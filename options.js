const PALETTE_STORAGE_KEY = 'directorio-palette';
const FONT_STORAGE_KEY = 'directorio-font';
const FONT_CYCLE = ['default', 'opendyslexic', 'lexend'];

const FONT_LABELS = {
  default: 'Playfair Display',
  opendyslexic: 'OpenDyslexic',
  lexend: 'Lexend',
};

function setPalette(paletteName) {
  document.documentElement.setAttribute('data-palette', paletteName);
  localStorage.setItem(PALETTE_STORAGE_KEY, paletteName);
  updatePaletteSwitch(paletteName);
}

function updatePaletteSwitch(activePalette) {
  const button = document.getElementById('paletteSwitch');

  if (!button) {
    return;
  }

  button.setAttribute(
    'aria-label',
    activePalette === 'lightPalette'
      ? 'Cambiar a paleta oscura'
      : 'Cambiar a paleta clara'
  );
  button.classList.toggle('options-menu__button--active', activePalette === 'darkPalette');
}

function togglePalette() {
  const currentPalette =
    document.documentElement.getAttribute('data-palette') || 'lightPalette';
  const nextPalette =
    currentPalette === 'lightPalette' ? 'darkPalette' : 'lightPalette';

  setPalette(nextPalette);
}

function setFont(fontName) {
  document.documentElement.setAttribute('data-font', fontName);
  localStorage.setItem(FONT_STORAGE_KEY, fontName);
  updateFontButton(fontName);
}

function cycleFont() {
  const currentFont = document.documentElement.getAttribute('data-font') || 'default';
  const currentIndex = FONT_CYCLE.indexOf(currentFont);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % FONT_CYCLE.length;
  setFont(FONT_CYCLE[nextIndex]);
}

function updateFontButton(fontName) {
  const button = document.getElementById('fontSwitch');

  if (!button) {
    return;
  }

  button.setAttribute(
    'aria-label',
    `Cambiar fuente (actual: ${FONT_LABELS[fontName] || fontName})`
  );
}

function initPalette() {
  const savedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
  const defaultPalette = 'lightPalette';
  const palette = savedPalette || defaultPalette;

  setPalette(palette);

  document.getElementById('paletteSwitch')?.addEventListener('click', togglePalette);
}

function initFont() {
  const savedFont = localStorage.getItem(FONT_STORAGE_KEY);
  const font = FONT_CYCLE.includes(savedFont) ? savedFont : 'default';

  setFont(font);

  document.getElementById('fontSwitch')?.addEventListener('click', cycleFont);
}

initPalette();
initFont();
