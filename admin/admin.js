/**
 * VHUWON MATHERS — Admin Panel Core Controller
 * Domain: gautambhuwan.com.np/admin
 * 
 * Features:
 * - SHA-256 PIN authentication with keypad & lock timeout
 * - GitHub REST API integration for serverless direct commits to origin/main
 * - Free Mail Server (Zoho Mail MX, SPF, DKIM, DMARC) DNS checklist & copy tools
 * - Web3Forms contact form integration & live test transmission
 * - Full CRUD & GitHub sync for 100+ Lexicon Terms
 * - Blog & Article drafting with live Markdown preview
 * - Full site data export & backup
 */

(function () {
  'use strict';

  // Constants & Storage Keys
  const STORAGE_KEYS = {
    TOTP_SECRET: 'vm_admin_totp_secret',
    PIN_HASH: 'vm_admin_pin_hash',
    SESSION_AUTH: 'vm_admin_authenticated',
    GITHUB_PAT: 'vm_github_pat',
    WEB3FORMS_KEY: 'vm_web3forms_key',
    REPO_OWNER: 'sudovu',
    REPO_NAME: 'gautambhuwan.com.np',
    REPO_BRANCH: 'main'
  };

  // Google Authenticator Default Secret (16-char Base32)
  const DEFAULT_TOTP_SECRET = 'GAUTAMBHUWAN2FA1';
  const EMERGENCY_PIN = '1337';

  // Application State
  let enteredPin = '';
  let activeTab = 'dashboard';
  let lexiconCache = [];
  let blogCache = [];

  // DOM Elements cache
  let lockScreen, pinDots, keypadBtns, lockErrorMsg;
  let tabButtons, tabPanels;
  let toastContainer;

  // Initialize Admin
  document.addEventListener('DOMContentLoaded', () => {
    initDomReferences();
    initTheme();
    initAuth();
    initTabs();
    initCopyButtons();
    initMailSettings();
    initLexiconManager();
    initBlogManager();
    initSettingsTab();
    initSecurityConfigModal();
  });

  /* ==========================================================================
     Theme Management
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem('vm_theme_preference') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('admin-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('vm_theme_preference', next);
      });
    }
  }

  /* ==========================================================================
     DOM References & Helpers
     ========================================================================== */
  function initDomReferences() {
    lockScreen = document.getElementById('admin-lock-screen');
    pinDots = document.querySelectorAll('.pin-dot');
    keypadBtns = document.querySelectorAll('.keypad-btn');
    lockErrorMsg = document.getElementById('lock-error-msg');
    tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabPanels = document.querySelectorAll('.admin-tab-panel');
    toastContainer = document.getElementById('admin-toast-container');
  }

  /* ==========================================================================
     Authentication & PIN Lock
     ========================================================================== */
  /* ==========================================================================
     RFC 6238 TOTP (Google Authenticator) Implementation via Web Crypto API
     ========================================================================== */
  function base32Decode(base32) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0, value = 0, index = 0;
    const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
    const bytes = new Uint8Array(Math.floor(clean.length * 5 / 8));
    for (let i = 0; i < clean.length; i++) {
      const val = alphabet.indexOf(clean[i]);
      if (val === -1) continue;
      value = (value << 5) | val;
      bits += 5;
      if (bits >= 8) {
        bytes[index++] = (value >>> (bits - 8)) & 255;
        bits -= 8;
      }
    }
    return bytes;
  }

  async function computeTOTP(secretBase32, counterOffset = 0) {
    const keyBytes = base32Decode(secretBase32);
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30) + counterOffset;

    // 8-byte big-endian counter
    const counterBuffer = new ArrayBuffer(8);
    const view = new DataView(counterBuffer);
    view.setUint32(0, Math.floor(counter / 0x100000000), false);
    view.setUint32(4, counter >>> 0, false);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: { name: 'SHA-1' } },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
    const hmac = new Uint8Array(signature);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary = ((hmac[offset] & 0x7f) << 24) |
                   ((hmac[offset + 1] & 0xff) << 16) |
                   ((hmac[offset + 2] & 0xff) << 8) |
                   (hmac[offset + 3] & 0xff);
    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }

  
  function renderOfflineQRCode(elementId, text) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(el, {
          text: text,
          width: 180,
          height: 180,
          colorDark: '#020617',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        el.innerHTML = '<p style="color: var(--text-dim); font-size: 0.75rem;">(Offline QR script loading...)</p>';
      }
    } catch (e) {
      console.warn('QR render error:', e);
    }
  }

  function getActiveTotpSecret() {
    return localStorage.getItem(STORAGE_KEYS.TOTP_SECRET) || DEFAULT_TOTP_SECRET;
  }
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function initAuth() {
    const isAuth = sessionStorage.getItem(STORAGE_KEYS.SESSION_AUTH);
    if (isAuth === 'true') {
      unlockAdmin();
    } else {
      lockAdmin();
    }

    // Direct input field support
    const keyInput = document.getElementById('pin-keyboard-input');
    if (keyInput) {
      keyInput.addEventListener('input', () => {
        enteredPin = keyInput.value.replace(/[^0-9]/g, '').slice(0, 6);
        updatePinDots();
        if (enteredPin.length >= 4) {
          verifyPin();
        }
      });
      keyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          verifyPin();
        }
      });
    }


    // Setup Google Authenticator Modal
    const openSetupBtn = document.getElementById('open-totp-setup-btn');
    const closeSetupBtn = document.getElementById('close-totp-setup-btn');
    const confirmSetupBtn = document.getElementById('confirm-totp-setup-btn');
    const setupModal = document.getElementById('totp-setup-modal-overlay');
    const qrImg = document.getElementById('totp-qr-image');
    const secretText = document.getElementById('totp-secret-text');
    const copySecretBtn = document.getElementById('copy-totp-secret-btn');

    function openTotpSetup() {
      const secret = getActiveTotpSecret();
      if (secretText) secretText.textContent = secret;
      const otpauth = `otpauth://totp/Bhuwan%20Admin:admin@gautambhuwan.com.np?secret=${secret}&issuer=Bhuwan%20Gautam`;
      renderOfflineQRCode('totp-qr-container', otpauth);
      if (setupModal) setupModal.classList.add('active');
    }

    if (openSetupBtn) openSetupBtn.addEventListener('click', openTotpSetup);
    if (closeSetupBtn) closeSetupBtn.addEventListener('click', () => setupModal.classList.remove('active'));
    if (confirmSetupBtn) confirmSetupBtn.addEventListener('click', () => {
      setupModal.classList.remove('active');
      const keyInput = document.getElementById('pin-keyboard-input');
      if (keyInput) keyInput.focus();
    });

    if (copySecretBtn) {
      copySecretBtn.addEventListener('click', () => {
        const secret = getActiveTotpSecret();
        navigator.clipboard.writeText(secret).then(() => {
          copySecretBtn.textContent = 'COPIED!';
          setTimeout(() => copySecretBtn.textContent = 'COPY', 1800);
        });
      });
    }

    // Keypad button clicks
    keypadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        handleKeypadInput(val);
      });
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (lockScreen && lockScreen.style.display !== 'none') {
        if (/^[0-9]$/.test(e.key)) {
          handleKeypadInput(e.key);
        } else if (e.key === 'Backspace') {
          handleKeypadInput('del');
        } else if (e.key === 'Enter') {
          handleKeypadInput('enter');
        }
      }
    });

    // Logout / Lock Button
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION_AUTH);
        lockAdmin();
        showToast('Admin session locked.', 'info');
      });
    }
  }

  async function handleKeypadInput(val) {
    if (val === 'del') {
      enteredPin = enteredPin.slice(0, -1);
      updatePinDots();
      return;
    }

    if (val === 'enter') {
      verifyPin();
      return;
    }

    if (enteredPin.length < 6) {
      enteredPin += val;
      updatePinDots();
      if (enteredPin.length >= 4) {
        verifyPin();
      }
    }
  }

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
    const keyInput = document.getElementById('pin-keyboard-input');
    if (keyInput && keyInput.value !== enteredPin) {
      keyInput.value = enteredPin;
    }
    if (lockErrorMsg) lockErrorMsg.textContent = '';
  }

  async function verifyPin() {
    if (enteredPin.length < 4) return;

    // 1. Check custom configured master password/PIN
    const customHash = localStorage.getItem(STORAGE_KEYS.PIN_HASH);
    const inputHash = await sha256(enteredPin);

    if (customHash && inputHash === customHash) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_AUTH, 'true');
      unlockAdmin();
      showToast('Master password verified. Welcome!', 'success');
      enteredPin = '';
      updatePinDots();
      return;
    }

    // 2. Check emergency initial master passcode if not yet configured
    if (!customHash && enteredPin === EMERGENCY_PIN) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_AUTH, 'true');
      unlockAdmin();
      showToast('Initial authorization granted.', 'success');
      enteredPin = '';
      updatePinDots();
      return;
    }

    // 3. Check Google Authenticator (TOTP rolling 6 digits)
    if (enteredPin.length === 6) {
      const secret = getActiveTotpSecret();
      const [currentTotp, prevTotp, nextTotp] = await Promise.all([
        computeTOTP(secret, 0),
        computeTOTP(secret, -1),
        computeTOTP(secret, 1)
      ]);

      const isTotpMatch = (enteredPin === currentTotp || enteredPin === prevTotp || enteredPin === nextTotp);

      if (isTotpMatch) {
        sessionStorage.setItem(STORAGE_KEYS.SESSION_AUTH, 'true');
        unlockAdmin();
        showToast('Google Authenticator 2FA verified. Welcome!', 'success');
        enteredPin = '';
        updatePinDots();
        return;
      }
    }

    if (enteredPin.length >= 4) {
      const card = document.querySelector('.admin-lock-card');
      if (card) {
        card.classList.add('shake-animation');
        setTimeout(() => card.classList.remove('shake-animation'), 400);
      }
      if (lockErrorMsg) {
        lockErrorMsg.textContent = 'Invalid Google Authenticator code. Check your phone clock/code.';
      }
      enteredPin = '';
      updatePinDots();
    }
  }

  function unlockAdmin() {
    if (lockScreen) {
      lockScreen.style.opacity = '0';
      lockScreen.style.visibility = 'hidden';
      setTimeout(() => lockScreen.style.display = 'none', 300);
    }
    refreshDashboardStats();

    // Check if initial security configuration / password change is needed
    const isConfigured = localStorage.getItem('vm_admin_password_configured');
    if (isConfigured !== 'true') {
      setTimeout(() => {
        openSecurityConfigModal(true);
      }, 500);
    }
  }

  function lockAdmin() {
    if (lockScreen) {
      lockScreen.style.display = 'flex';
      lockScreen.style.opacity = '1';
      lockScreen.style.visibility = 'visible';
    }
    enteredPin = '';
    updatePinDots();
  }

  /* ==========================================================================
     Tab Navigation
     ========================================================================== */
  function initTabs() {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        switchTab(target);
      });
    });
  }

  function switchTab(tabId) {
    activeTab = tabId;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <div style="flex: 1; font-weight: 500;">${escapeHtml(message)}</div>
      <button style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 1rem;">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => toast.remove());
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ==========================================================================
     GitHub REST API Direct Commits (Serverless Deployment)
     ========================================================================== */
  async function getGithubHeaders() {
    const pat = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT);
    if (!pat) return null;
    return {
      'Authorization': `token ${pat}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  async function testGithubConnection() {
    const headers = await getGithubHeaders();
    if (!headers) {
      showToast('No GitHub Token provided. Set your token in Settings.', 'error');
      return false;
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${STORAGE_KEYS.REPO_OWNER}/${STORAGE_KEYS.REPO_NAME}`, { headers });
      if (res.ok) {
        const repoData = await res.json();
        showToast(`Connected to ${repoData.full_name} (${repoData.default_branch})`, 'success');
        updateGithubStatusIndicator(true, repoData);
        return true;
      } else {
        showToast(`GitHub API error: ${res.statusText}`, 'error');
        updateGithubStatusIndicator(false);
        return false;
      }
    } catch (err) {
      showToast('Network error while testing GitHub token', 'error');
      updateGithubStatusIndicator(false);
      return false;
    }
  }

  function updateGithubStatusIndicator(isConnected, repoData = null) {
    const statusDot = document.getElementById('github-status-dot');
    const statusText = document.getElementById('github-status-text');
    if (statusDot && statusText) {
      if (isConnected) {
        statusDot.style.background = '#10b981';
        statusText.textContent = `SYNC ACTIVE (${STORAGE_KEYS.REPO_OWNER}/${STORAGE_KEYS.REPO_NAME})`;
      } else {
        statusDot.style.background = '#f59e0b';
        statusText.textContent = 'OFFLINE / READ-ONLY';
      }
    }
  }

  async function commitFileToGithub(filePath, fileContent, commitMessage) {
    const headers = await getGithubHeaders();
    if (!headers) {
      showToast('Cannot commit: GitHub Personal Access Token is missing. Add it in Settings.', 'error');
      return false;
    }

    try {
      showToast(`Committing ${filePath} to GitHub...`, 'info');

      // 1. Fetch current file SHA
      const getRes = await fetch(`https://api.github.com/repos/${STORAGE_KEYS.REPO_OWNER}/${STORAGE_KEYS.REPO_NAME}/contents/${filePath}?ref=${STORAGE_KEYS.REPO_BRANCH}`, { headers });
      
      let currentSha = null;
      if (getRes.ok) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
      }

      // 2. Base64 encode content safely with UTF-8
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

      // 3. Put File
      const putBody = {
        message: commitMessage || `Update ${filePath} via Admin Hub`,
        content: encodedContent,
        branch: STORAGE_KEYS.REPO_BRANCH
      };
      if (currentSha) {
        putBody.sha = currentSha;
      }

      const putRes = await fetch(`https://api.github.com/repos/${STORAGE_KEYS.REPO_OWNER}/${STORAGE_KEYS.REPO_NAME}/contents/${filePath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(putBody)
      });

      if (putRes.ok) {
        showToast(`Successfully committed ${filePath}! GitHub Pages will redeploy in ~30s.`, 'success');
        return true;
      } else {
        const errJson = await putRes.json();
        showToast(`Commit failed: ${errJson.message || putRes.statusText}`, 'error');
        return false;
      }
    } catch (err) {
      showToast(`Network error committing to GitHub: ${err.message}`, 'error');
      return false;
    }
  }

  /* ==========================================================================
     Dashboard Stats & Quick Actions
     ========================================================================== */
  function refreshDashboardStats() {
    // 1. Lexicon Count
    const termCountEl = document.getElementById('dash-term-count');
    if (termCountEl) {
      const count = window.LEXICON_DATA ? window.LEXICON_DATA.length : 100;
      termCountEl.textContent = count;
    }

    // 2. Check GitHub PAT
    const pat = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT);
    if (pat) {
      testGithubConnection();
    } else {
      updateGithubStatusIndicator(false);
    }
  }

  /* ==========================================================================
     Free Mail Server & DNS Setup
     ========================================================================== */
  function initMailSettings() {
    const keyInput = document.getElementById('web3forms-key-input');
    const saveKeyBtn = document.getElementById('save-web3forms-btn');
    const testEmailBtn = document.getElementById('test-email-btn');

    // Load saved key
    if (keyInput) {
      keyInput.value = localStorage.getItem(STORAGE_KEYS.WEB3FORMS_KEY) || '';
    }

    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        localStorage.setItem(STORAGE_KEYS.WEB3FORMS_KEY, key);
        showToast('Web3Forms Access Key saved successfully.', 'success');
      });
    }

    if (testEmailBtn) {
      testEmailBtn.addEventListener('click', async () => {
        const key = keyInput.value.trim() || localStorage.getItem(STORAGE_KEYS.WEB3FORMS_KEY);
        if (!key) {
          showToast('Please enter your Web3Forms Access Key first.', 'error');
          return;
        }

        testEmailBtn.disabled = true;
        testEmailBtn.textContent = 'Transmitting Test...';

        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              access_key: key,
              name: 'Vhuwon Mathers Admin Hub',
              email: 'admin@gautambhuwan.com.np',
              subject: 'Mail Server Diagnostics Test',
              message: 'This is a test message sent from gautambhuwan.com.np/admin to verify free mail forwarding to info@gautambhuwan.com.np.'
            })
          });

          const data = await res.json();
          if (data.success) {
            showToast('✓ Test email dispatched successfully! Check info@gautambhuwan.com.np.', 'success');
          } else {
            showToast(`Web3Forms error: ${data.message}`, 'error');
          }
        } catch (err) {
          showToast('Network error during test email transmission.', 'error');
        } finally {
          testEmailBtn.disabled = false;
          testEmailBtn.textContent = 'Send Test Email';
        }
      });
    }
  }

  function initCopyButtons() {
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'COPIED!';
            btn.style.background = '#10b981';
            btn.style.color = '#ffffff';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = '';
              btn.style.color = '';
            }, 1800);
          });
        }
      });
    });
  }

  /* ==========================================================================
     Lexicon Terms Manager
     ========================================================================== */
  function initLexiconManager() {
    const tableBody = document.getElementById('lexicon-admin-table-body');
    const searchInput = document.getElementById('lexicon-admin-search');
    const catFilter = document.getElementById('lexicon-admin-cat-filter');
    const addNewBtn = document.getElementById('lexicon-add-new-btn');
    const commitBtn = document.getElementById('lexicon-commit-btn');
    const downloadBtn = document.getElementById('lexicon-download-btn');

    // Populate local cache from window.LEXICON_DATA
    if (window.LEXICON_DATA && window.LEXICON_DATA.length > 0) {
      lexiconCache = JSON.parse(JSON.stringify(window.LEXICON_DATA));
      renderLexiconTable();
    } else {
      // Fetch js/lexicon.js if not yet loaded
      fetch('../js/lexicon.js')
        .then(res => res.text())
        .then(code => {
          const match = code.match(/const\s+LEXICON_DATA\s*=\s*(\[[\s\S]*?\]);/);
          if (match && match[1]) {
            lexiconCache = JSON.parse(match[1]);
            window.LEXICON_DATA = lexiconCache;
            renderLexiconTable();
            refreshDashboardStats();
          }
        })
        .catch(() => {
          console.warn('Could not load lexicon data automatically');
        });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => renderLexiconTable());
    }

    if (catFilter) {
      catFilter.addEventListener('change', () => renderLexiconTable());
    }

    if (addNewBtn) {
      addNewBtn.addEventListener('click', () => openTermModal());
    }

    if (commitBtn) {
      commitBtn.addEventListener('click', async () => {
        if (!confirm(`Commit ${lexiconCache.length} terms directly to origin/main? This will redeploy the live website.`)) return;

        // Fetch the full original js/lexicon.js to preserve all functions
        try {
          const res = await fetch('../js/lexicon.js');
          const fileText = await res.text();
          const jsonString = JSON.stringify(lexiconCache, null, 2);
          const updatedFileText = fileText.replace(
            /const\s+LEXICON_DATA\s*=\s*\[[\s\S]*?\];/,
            `const LEXICON_DATA = ${jsonString};`
          );

          await commitFileToGithub(
            'js/lexicon.js',
            updatedFileText,
            `Update Lexicon terms (${lexiconCache.length} total) via Admin Panel`
          );
        } catch (err) {
          showToast(`Error updating lexicon file: ${err.message}`, 'error');
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lexiconCache, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "lexicon_data.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Downloaded lexicon_data.json backup.', 'success');
      });
    }

    initTermModal();
  }

  function renderLexiconTable() {
    const tableBody = document.getElementById('lexicon-admin-table-body');
    const searchInput = document.getElementById('lexicon-admin-search');
    const catFilter = document.getElementById('lexicon-admin-cat-filter');
    if (!tableBody) return;

    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const cat = catFilter ? catFilter.value : 'all';

    const filtered = lexiconCache.filter(item => {
      const matchCat = cat === 'all' || item.category === cat;
      const matchQuery = !query || 
        item.term.toLowerCase().includes(query) ||
        item.full.toLowerCase().includes(query) ||
        item.layman.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 32px;">No matching terms found</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr>
        <td>
          <strong style="color: var(--accent-secondary);">${escapeHtml(item.term)}</strong><br>
          <span style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">#${escapeHtml(item.id)}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(item.full)}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.layman)}</div>
        </td>
        <td>
          <span class="tag" style="border-color: ${item.categoryColor || '#06b6d4'}40; color: ${item.categoryColor || '#06b6d4'};">
            ${escapeHtml(item.categoryLabel || item.category)}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; max-width: 200px;">
            ${(item.tags || []).slice(0, 3).map(t => `<span class="tag" style="font-size: 0.68rem; padding: 2px 6px;">${escapeHtml(t)}</span>`).join('')}
          </div>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-outline btn-sm edit-term-btn" data-id="${item.id}" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
          <button class="btn btn-outline btn-sm delete-term-btn" data-id="${item.id}" style="padding: 4px 8px; font-size: 0.75rem; border-color: rgba(239, 68, 68, 0.4); color: #ef4444; margin-left: 6px;">Delete</button>
        </td>
      </tr>
    `).join('');

    // Attach listeners
    tableBody.querySelectorAll('.edit-term-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const termItem = lexiconCache.find(t => t.id === id);
        if (termItem) openTermModal(termItem);
      });
    });

    tableBody.querySelectorAll('.delete-term-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete term "${id}"?`)) {
          lexiconCache = lexiconCache.filter(t => t.id !== id);
          renderLexiconTable();
          refreshDashboardStats();
          showToast(`Deleted term "${id}". Remember to click Commit to save changes.`, 'info');
        }
      });
    });
  }

  function initTermModal() {
    const modalOverlay = document.getElementById('term-modal-overlay');
    const closeBtn = document.getElementById('close-term-modal-btn');
    const cancelBtn = document.getElementById('cancel-term-modal-btn');
    const saveBtn = document.getElementById('save-term-modal-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => closeTermModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeTermModal());

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const id = document.getElementById('modal-term-id').value.trim();
        const term = document.getElementById('modal-term-name').value.trim();
        const full = document.getElementById('modal-term-full').value.trim();
        const category = document.getElementById('modal-term-cat').value;
        const layman = document.getElementById('modal-term-layman').value.trim();
        const technical = document.getElementById('modal-term-tech').value.trim();
        const whyItMatters = document.getElementById('modal-term-impact').value.trim();
        const tags = document.getElementById('modal-term-tags').value.split(',').map(s => s.trim()).filter(Boolean);

        if (!id || !term || !full || !layman) {
          alert('Please fill in Term, ID, Full Name, and Plain English analogy.');
          return;
        }

        const categoryLabels = {
          networking: 'Networking & Protocols',
          systems: 'Systems & Linux OS',
          fiber: 'Fiber Optics & Hardware',
          cloud: 'Cloud & Architecture',
          security: 'Security & Access'
        };

        const categoryColors = {
          networking: '#06b6d4',
          systems: '#10b981',
          fiber: '#f59e0b',
          cloud: '#38bdf8',
          security: '#f43f5e'
        };

        const newItem = {
          id,
          term,
          full,
          category,
          categoryLabel: categoryLabels[category] || category,
          categoryColor: categoryColors[category] || '#06b6d4',
          layman,
          technical,
          whyItMatters,
          tags
        };

        const existingIdx = lexiconCache.findIndex(t => t.id === id);
        if (existingIdx >= 0) {
          lexiconCache[existingIdx] = newItem;
          showToast(`Updated term "${term}".`, 'success');
        } else {
          lexiconCache.unshift(newItem);
          showToast(`Added new term "${term}".`, 'success');
        }

        closeTermModal();
        renderLexiconTable();
        refreshDashboardStats();
      });
    }
  }

  function openTermModal(item = null) {
    const modal = document.getElementById('term-modal-overlay');
    if (!modal) return;

    document.getElementById('term-modal-title').textContent = item ? `Edit Term: ${item.term}` : 'Add New Lexicon Term';
    document.getElementById('modal-term-id').value = item ? item.id : '';
    document.getElementById('modal-term-id').disabled = !!item;
    document.getElementById('modal-term-name').value = item ? item.term : '';
    document.getElementById('modal-term-full').value = item ? item.full : '';
    document.getElementById('modal-term-cat').value = item ? item.category : 'networking';
    document.getElementById('modal-term-layman').value = item ? item.layman : '';
    document.getElementById('modal-term-tech').value = item ? item.technical : '';
    document.getElementById('modal-term-impact').value = item ? item.whyItMatters : '';
    document.getElementById('modal-term-tags').value = item && item.tags ? item.tags.join(', ') : '';

    modal.classList.add('active');
  }

  function closeTermModal() {
    const modal = document.getElementById('term-modal-overlay');
    if (modal) modal.classList.remove('active');
  }

  /* ==========================================================================
     Blog & Articles Manager
     ========================================================================== */
  function initBlogManager() {
    const articleList = document.getElementById('blog-admin-list');
    const commitBlogBtn = document.getElementById('blog-commit-btn');

    // Fetch data/blog.json
    fetch('../data/blog.json')
      .then(res => res.json())
      .then(data => {
        blogCache = data;
        renderBlogList();
      })
      .catch(() => {
        console.warn('Could not load blog.json');
      });

    if (commitBlogBtn) {
      commitBlogBtn.addEventListener('click', async () => {
        if (!confirm('Commit updated blog.json directly to GitHub?')) return;
        const jsonContent = JSON.stringify(blogCache, null, 2);
        await commitFileToGithub('data/blog.json', jsonContent, 'Update articles metadata via Admin Panel');
      });
    }

    // Markdown preview handler
    const mdInput = document.getElementById('article-content-input');
    const mdPreview = document.getElementById('article-preview-pane');
    if (mdInput && mdPreview) {
      mdInput.addEventListener('input', () => {
        // Simple client markdown preview parser
        mdPreview.innerHTML = parseSimpleMarkdown(mdInput.value);
      });
    }
  }

  function renderBlogList() {
    const list = document.getElementById('blog-admin-list');
    if (!list) return;

    list.innerHTML = blogCache.map(article => `
      <div class="card" style="padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h4 style="margin: 0 0 4px 0; font-size: 0.95rem;">${escapeHtml(article.title)}</h4>
          <span class="mono-label" style="font-size: 0.72rem; color: var(--accent-secondary);">${escapeHtml(article.category)}</span>
          <span style="font-size: 0.72rem; color: var(--text-dim); margin-left: 10px;">${escapeHtml(article.date || '')}</span>
        </div>
        <a href="../${article.url || 'blog.html'}" target="_blank" class="btn btn-outline btn-sm" style="font-size: 0.75rem;">View</a>
      </div>
    `).join('');
  }

  function parseSimpleMarkdown(md) {
    if (!md) return '<p style="color: var(--text-dim); font-style: italic;">Live preview appears here...</p>';
    let html = escapeHtml(md);
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold / Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    // Code blocks & inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    // Line breaks
    html = html.replace(/\n\n/gim, '</p><p>');
    return '<p>' + html + '</p>';
  }

  /* ==========================================================================
     Settings Tab: GitHub Token, PIN & Backup
     ========================================================================== */
  function initSettingsTab() {
    const patInput = document.getElementById('github-pat-input');
    const savePatBtn = document.getElementById('save-github-pat-btn');
    const testPatBtn = document.getElementById('test-github-pat-btn');

    const currentPinInput = document.getElementById('setting-current-pin');
    const newPinInput = document.getElementById('setting-new-pin');
    const savePinBtn = document.getElementById('save-new-pin-btn');

    const exportAllBtn = document.getElementById('export-all-backup-btn');

    // Load PAT
    if (patInput) {
      patInput.value = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT) || '';
    }

    if (savePatBtn) {
      savePatBtn.addEventListener('click', () => {
        const token = patInput.value.trim();
        localStorage.setItem(STORAGE_KEYS.GITHUB_PAT, token);
        showToast('GitHub Personal Access Token saved locally.', 'success');
        testGithubConnection();
      });
    }

    if (testPatBtn) {
      testPatBtn.addEventListener('click', () => {
        testGithubConnection();
      });
    }

    if (savePinBtn) {
      savePinBtn.addEventListener('click', async () => {
        const cur = currentPinInput.value.trim();
        const nxt = newPinInput.value.trim();

        if (nxt.length < 4) {
          showToast('New PIN must be at least 4 digits.', 'error');
          return;
        }

        const storedHash = localStorage.getItem(STORAGE_KEYS.PIN_HASH) || DEFAULT_PIN_HASH;
        const inputCurHash = await sha256(cur);

        if (inputCurHash !== storedHash) {
          showToast('Current PIN is incorrect.', 'error');
          return;
        }

        const newHash = await sha256(nxt);
        localStorage.setItem(STORAGE_KEYS.PIN_HASH, newHash);
        currentPinInput.value = '';
        newPinInput.value = '';
        showToast('Security PIN changed successfully.', 'success');
      });
    }

    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        const backupData = {
          date: new Date().toISOString(),
          domain: 'gautambhuwan.com.np',
          lexicon: lexiconCache,
          blog: blogCache
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `backup_gautambhuwan_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Full system backup exported.', 'success');
      });
    }
  }


  /* ==========================================================================
     Mandatory Post-Login Security Configuration & Password Change Modal
     ========================================================================== */
  function initSecurityConfigModal() {
    const modal = document.getElementById('security-config-modal-overlay');
    const closeBtn = document.getElementById('close-security-modal-btn');
    const cancelBtn = document.getElementById('cancel-security-modal-btn');
    const saveBtn = document.getElementById('save-security-modal-btn');
    const openFromSettingsBtn = document.getElementById('open-security-modal-from-settings');
    const copySecretBtn = document.getElementById('cfg-copy-secret-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (openFromSettingsBtn) openFromSettingsBtn.addEventListener('click', () => openSecurityConfigModal(false));

    if (copySecretBtn) {
      copySecretBtn.addEventListener('click', () => {
        const secret = getActiveTotpSecret();
        navigator.clipboard.writeText(secret).then(() => {
          copySecretBtn.textContent = 'COPIED!';
          setTimeout(() => copySecretBtn.textContent = 'COPY', 1800);
        });
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const newPass = document.getElementById('cfg-new-password').value.trim();
        const confPass = document.getElementById('cfg-confirm-password').value.trim();
        const totpCode = document.getElementById('cfg-totp-verify-input').value.trim();
        const errEl = document.getElementById('cfg-verify-error');

        if (errEl) errEl.textContent = '';

        // Validation
        if (!newPass || newPass.length < 4) {
          if (errEl) errEl.textContent = 'Password must be at least 4 characters/digits long.';
          return;
        }

        if (newPass !== confPass) {
          if (errEl) errEl.textContent = 'Passwords do not match.';
          return;
        }

        if (!totpCode || totpCode.length !== 6) {
          if (errEl) errEl.textContent = 'Please enter the 6-digit code currently showing in Google Authenticator.';
          return;
        }

        // Verify the 6-digit code against current secret
        const secret = getActiveTotpSecret();
        const [cur, prev, nxt] = await Promise.all([
          computeTOTP(secret, 0),
          computeTOTP(secret, -1),
          computeTOTP(secret, 1)
        ]);

        if (totpCode !== cur && totpCode !== prev && totpCode !== nxt) {
          if (errEl) errEl.textContent = 'Incorrect 6-digit code. Check your phone clock and re-enter code.';
          return;
        }

        // Save password hash and mark configured
        const passHash = await sha256(newPass);
        localStorage.setItem(STORAGE_KEYS.PIN_HASH, passHash);
        localStorage.setItem('vm_admin_password_configured', 'true');

        modal.classList.remove('active');
        showToast('✓ Security credentials successfully updated and locked!', 'success');
      });
    }
  }

  function openSecurityConfigModal(isFirstTime = false) {
    const modal = document.getElementById('security-config-modal-overlay');
    if (!modal) return;

    const secret = getActiveTotpSecret();
    const secretText = document.getElementById('cfg-totp-secret-text');
    if (secretText) secretText.textContent = secret;

    const otpauth = `otpauth://totp/Bhuwan%20Admin:admin@gautambhuwan.com.np?secret=${secret}&issuer=Bhuwan%20Gautam`;
    renderOfflineQRCode('cfg-totp-qr-container', otpauth);

    document.getElementById('cfg-new-password').value = '';
    document.getElementById('cfg-confirm-password').value = '';
    document.getElementById('cfg-totp-verify-input').value = '';
    const errEl = document.getElementById('cfg-verify-error');
    if (errEl) errEl.textContent = '';

    modal.classList.add('active');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
