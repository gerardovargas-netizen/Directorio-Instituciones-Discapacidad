function setupCMSAccordion() {
  const toggle = document.getElementById('cms-toggle');
  const panel = document.getElementById('cms-form-panel');
  const iframe = panel.querySelector('.cms-form__iframe');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('cms-form-panel--open');
    toggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen && iframe && !iframe.src && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
  });
}

setupCMSAccordion();
