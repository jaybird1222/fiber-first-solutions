// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Simple form handler (client-side success for now)
  // Replace with Formspree, Netlify Forms, or your preferred endpoint later
  const form = document.getElementById('lead-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect data (you can send this to your email service or CRM)
      const data = {
        name: form.name.value,
        company: form.company.value,
        email: form.email.value,
        phone: form.phone.value,
        need: form.need.value,
        message: form.message.value,
        source: 'fiberfirstsolutions.com',
        timestamp: new Date().toISOString()
      };

      console.log('Lead submitted:', data);

      // For production: send to Formspree, Make.com, Zapier, or your backend
      // Example Formspree (replace YOUR_FORM_ID):
      // fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Show success state
      form.hidden = true;
      if (success) {
        success.hidden = false;
      }

      // Optional: reset after a few seconds or keep success visible
    });
  }

  // Smooth close mobile nav on link click
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
    });
  });
});

// Add open styles for mobile nav via JS-added class (or add to CSS)
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
