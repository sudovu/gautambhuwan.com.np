/**
 * VHUWON MATHERS — Contact Form Validation & Real Mail Dispatcher
 * Integrates Web3Forms (100% Free) with graceful fallback to mailto:
 * Domain: gautambhuwan.com.np
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'info@gautambhuwan.com.np';
      window.AppData.copyToClipboard(email, copyBtn);
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackBox = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('active'));

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (!name) {
      showError('name-error', 'Please provide your name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subject) {
      showError('subject-error', 'Please include a subject.');
      isValid = false;
    }

    if (message.length < 10) {
      showError('message-error', 'Message must be at least 10 characters long.');
      isValid = false;
    }

    if (!isValid) return;

    // Check for configured Web3Forms Access Key
    const accessKey = localStorage.getItem('vm_web3forms_key');

    if (accessKey) {
      // Direct Web3Forms Inbound Delivery to Zoho Mail
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting to Server...</span>`;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: name,
            email: email,
            subject: `[Portfolio Inquiry] ${subject}`,
            message: message,
            from_name: 'gautambhuwan.com.np Contact Portal'
          })
        });

        const result = await response.json();

        if (result.success) {
          if (feedbackBox) {
            feedbackBox.innerHTML = `
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); color: #10b981; padding: 18px; border-radius: 8px; margin-top: 20px; animation: fadeIn 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 4px;">
                  <span>✓</span> Transmission Confirmed
                </div>
                <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5;">
                  Your message has been dispatched directly to Bhuwan's Zoho inbox (<a href="mailto:info@gautambhuwan.com.np" style="color: var(--accent-secondary); text-decoration: underline;">info@gautambhuwan.com.np</a>). Expect a prompt reply.
                </div>
              </div>
            `;
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Web3Forms service response was not successful.');
        }
      } catch (err) {
        showFallbackPrompt(name, email, subject, message, feedbackBox);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    } else {
      // Graceful fallback with prefilled mailto and instant email link
      showFallbackPrompt(name, email, subject, message, feedbackBox);
      form.reset();
    }
  });

  function showFallbackPrompt(name, email, subject, message, feedbackBox) {
    if (!feedbackBox) return;
    const mailtoUrl = `mailto:info@gautambhuwan.com.np?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;

    feedbackBox.innerHTML = `
      <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); padding: 18px; border-radius: 8px; margin-top: 20px;">
        <div style="font-weight: 700; color: var(--accent-secondary); margin-bottom: 6px;">
          Direct Mail Client Dispatch
        </div>
        <p class="body-sm" style="color: var(--text-secondary); margin-bottom: 14px;">
          Click below to transmit directly via your default email client to <strong style="color: var(--text-primary);">info@gautambhuwan.com.np</strong>:
        </p>
        <a href="${mailtoUrl}" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
          <span>Open Email Client &rarr;</span>
        </a>
      </div>
    `;
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.classList.add('active');
    }
  }
});
