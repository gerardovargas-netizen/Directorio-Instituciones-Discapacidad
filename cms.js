function setupCMSAccordion() {
  const toggle = document.getElementById('cms-toggle');
  const panel = document.getElementById('cms-form-panel');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('cms-form-panel--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

setupCMSAccordion();
