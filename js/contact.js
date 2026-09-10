/**
 * VHUWON MATHERS — Contact Form Validation & Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'contact@gautambhuwan.com.np';
      window.AppData.copyToClipboard(email, copyBtn);
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackBox = document.getElementById('form-feedback');

    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('active'));

    // Validation
    if (!nameInput.value.trim()) {
      showError('name-error', 'Please provide your name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError('email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subjectInput.value.trim()) {
      showError('subject-error', 'Please include a subject.');
      isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
      showError('message-error', 'Message must be at least 10 characters long.');
      isValid = false;
    }

    if (isValid) {
      // Show clean confirmation status
      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; padding: 16px; border-radius: 8px; margin-top: 20px;">
            <strong>Message Received</strong><br>
            Thank you for reaching out. In this static environment, you can also reach Vhuwon directly via email at <a href="mailto:info@gautambhuwan.com.np" style="color: #38bdf8; text-decoration: underline;">info@gautambhuwan.com.np</a>.
          </div>
        `;
      }
      form.reset();
    }
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.classList.add('active');
    }
  }
});
