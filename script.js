// Mobile menu toggle + lead form submission
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Lead form → /api/lead (sends email to jason@fiberfirstsolutions.com)
  const form = document.getElementById('lead-form');
  const success = document.getElementById('form-success');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const data = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        need: form.need.value,
        message: form.message.value.trim(),
        // honeypot
        website: form.website ? form.website.value : ''
      };

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || 'Something went wrong. Please try again.');
        }

        // Success
        form.hidden = true;
        if (success) {
          success.hidden = false;
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to send. Please email jason@fiberfirstsolutions.com directly.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Free Quotes';
        }
      }
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
    });
  });
});

// Mobile nav styles
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: white;
      padding: 24px;
      border-bottom: 1px solid var(--border);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      gap: 16px;
    }
    .mobile-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .mobile-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    .mobile-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);
