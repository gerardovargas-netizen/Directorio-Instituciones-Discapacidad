const ICON_PATHS = {
  close: 'icons/close.svg',
  fontSwitch: 'icons/fontSwitch.svg',
  switchPalette: 'icons/switchPalette.svg',
};

function iconUrl(relativePath) {
  return relativePath;
}

async function loadIcon(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load icon: ${path}`);
  }

  return response.text();
}

async function setButtonIcon(button, iconName) {
  if (!button) {
    return;
  }

  const svg = await loadIcon(iconUrl(ICON_PATHS[iconName]));
  button.innerHTML = svg;
  button.querySelector('svg')?.setAttribute('aria-hidden', 'true');
}

async function initIcons() {
  await Promise.all([
    setButtonIcon(document.getElementById('paletteSwitch'), 'switchPalette'),
    setButtonIcon(document.getElementById('fontSwitch'), 'fontSwitch'),
    setButtonIcon(document.querySelector('.lightbox__close'), 'close'),
  ]);
}

initIcons().catch((error) => {
  console.error(error);
});
