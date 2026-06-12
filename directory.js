const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

let allItems = [];
let activeLetter = null;
let activeTag = null;

function getFirstLetter(name) {
  const trimmed = name.trim().replace(/^["']+/, '');
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed[0]
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();

  return /^[A-Z]$/.test(normalized) ? normalized : null;
}

function getPresentLetters(items) {
  const letters = new Set();

  items.forEach((item) => {
    const letter = getFirstLetter(item.nombreInst);
    if (letter) {
      letters.add(letter);
    }
  });

  return letters;
}

function filterItemsByLetter(items, letter) {
  if (!letter) {
    return items;
  }

  return items.filter((item) => getFirstLetter(item.nombreInst) === letter);
}

function filterItemsByTag(items, tag) {
  if (!tag) {
    return items;
  }

  return items.filter((item) => parseTags(item.etiquetas).includes(tag));
}

function getFilteredItems() {
  let items = allItems;
  items = filterItemsByLetter(items, activeLetter);
  items = filterItemsByTag(items, activeTag);
  return items;
}

function updateDirectoryView() {
  const presentLetters = getPresentLetters(allItems);
  renderAlphabetFilter(presentLetters);
  renderActiveTagFilter();
  renderDirectory(getFilteredItems());
}

function setActiveTag(tag) {
  activeTag = tag;
  updateDirectoryView();
}

function clearActiveTag() {
  activeTag = null;
  updateDirectoryView();
}

function renderActiveTagFilter() {
  const container = document.getElementById('directory-tag-filter');
  container.replaceChildren();
  container.hidden = !activeTag;

  if (!activeTag) {
    return;
  }

  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'directory-tag-filter__chip';

  const label = document.createElement('span');
  label.className = 'directory-tag-filter__label';
  label.textContent = activeTag;

  const close = document.createElement('span');
  close.className = 'directory-tag-filter__close';
  close.textContent = 'x';
  close.setAttribute('aria-hidden', 'true');

  chip.appendChild(label);
  chip.appendChild(close);
  chip.addEventListener('click', clearActiveTag);
  container.appendChild(chip);
}

function renderAlphabetFilter(presentLetters) {
  const filter = document.getElementById('directory-filter');
  filter.replaceChildren();

  ALPHABET.forEach((letter) => {
    const isPresent = presentLetters.has(letter);

    if (isPresent) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'directory-filter__letter directory-filter__letter--present';
      button.textContent = letter;

      if (activeLetter === letter) {
        button.classList.add('directory-filter__letter--active');
      }

      button.addEventListener('click', () => {
        activeLetter = letter;
        updateDirectoryView();
      });

      filter.appendChild(button);
      return;
    }

    const span = document.createElement('span');
    span.className = 'directory-filter__letter directory-filter__letter--absent';
    span.textContent = letter;
    span.setAttribute('aria-hidden', 'true');
    filter.appendChild(span);
  });

  const todosButton = document.createElement('button');
  todosButton.type = 'button';
  todosButton.className = 'directory-filter__todos';
  todosButton.textContent = 'Todos';

  if (!activeLetter) {
    todosButton.classList.add('directory-filter__todos--active');
  }

  todosButton.addEventListener('click', () => {
    activeLetter = null;
    updateDirectoryView();
  });

  filter.appendChild(todosButton);
}

const ITEM_FIELDS = [
  { key: 'nombreInst', label: 'Nombre de la institución' },
  { key: 'numTel', label: 'Número de teléfono' },
  { key: 'dirCompleta', label: 'Dirección completa' },
  { key: 'sitioWeb', label: 'Sitio Web' },
  { key: 'mail', label: 'Correo electrónico' },
  { key: 'enlaceContacto', label: 'Enlace a formulario de contacto o informes' },
  { key: 'nombreServicio', label: 'Nombre del servicio' },
  { key: 'objetivoServicio', label: 'Objetivo del servicio' },
  { key: 'poblacionMeta', label: 'Población meta' },
  { key: 'reglasOperServicio', label: 'Reglas de operación del servicio' },
  { key: 'procesoSolicApoyo', label: 'Explicación breve para solicitar el servicio' },
  { key: 'etiquetas', label: 'Etiquetas' },
];

function parseCSVRow(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
  }

  fields.push(field);
  return fields;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }

      row.push(field);
      field = '';

      if (row.some((value) => value.trim())) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);

    if (row.some((value) => value.trim())) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0];

  return rows.slice(1).map((values) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = values[index] ?? '';
    });

    return item;
  });
}

function parseTags(tagString) {
  if (!tagString) {
    return [];
  }

  return tagString
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function createTagElements(tagString, clickable) {
  const container = document.createElement(clickable ? 'div' : 'span');
  container.className = clickable ? 'directory-item__tags' : 'lightbox__tags';

  parseTags(tagString).forEach((tag) => {
    if (clickable) {
      container.appendChild(createTagButton(tag));
      return;
    }

    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    container.appendChild(tagElement);
  });

  return container;
}

function createTagButton(tag) {
  const tagElement = document.createElement('button');
  tagElement.type = 'button';
  tagElement.className = 'tag tag--clickable';

  if (activeTag === tag) {
    tagElement.classList.add('tag--active');
  }

  tagElement.textContent = tag;
  tagElement.addEventListener('click', (event) => {
    event.stopPropagation();
    setActiveTag(tag);
  });

  return tagElement;
}

function createLightboxField(label, valueNode, isFirst) {
  const field = document.createElement('div');
  field.className = 'lightbox__field';

  const labelElement = document.createElement('span');
  labelElement.className = 'lightbox__label';
  labelElement.textContent = `${label}:`;
  if (isFirst) {
    labelElement.id = 'lightbox-title';
  }

  const valueElement = document.createElement('span');
  valueElement.className = 'lightbox__value';
  valueElement.appendChild(valueNode);

  field.appendChild(labelElement);
  field.appendChild(document.createTextNode(' '));
  field.appendChild(valueElement);

  return field;
}

function renderLightboxContent(item) {
  const content = document.getElementById('lightbox-content');
  content.replaceChildren();

  ITEM_FIELDS.forEach(({ key, label }, index) => {
    let valueNode;

    if (key === 'etiquetas') {
      valueNode = createTagElements(item.etiquetas, false);
    } else {
      valueNode = document.createTextNode(item[key] || '');
    }

    content.appendChild(createLightboxField(label, valueNode, index === 0));
  });
}

function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');

  renderLightboxContent(item);
  lightbox.hidden = false;
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('lightbox--open');
  document.body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox__close').focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');

  lightbox.hidden = true;
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.classList.remove('lightbox--open');
  document.body.classList.remove('lightbox-open');
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const dialog = lightbox.querySelector('.lightbox__dialog');

  lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });
}

function createDirectoryItem(item) {
  const card = document.createElement('article');
  card.className = 'directory-item directory-item--clickable';
  card.tabIndex = 0;

  const name = document.createElement('strong');
  name.className = 'directory-item__name';
  name.textContent = item.nombreInst;

  const tagsContainer = createTagElements(item.etiquetas, true);

  card.appendChild(name);
  card.appendChild(tagsContainer);

  card.addEventListener('click', () => {
    openLightbox(item);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(item);
    }
  });

  return card;
}

function renderDirectory(items) {
  const list = document.getElementById('directory-list');
  list.replaceChildren(...items.map(createDirectoryItem));
}

async function loadDirectory() {
  const response = await fetch(CSV_PATH, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to load ${CSV_PATH}`);
  }

  const text = (await response.text()).replace(/^\uFEFF/, '');
  allItems = parseCSV(text).sort((a, b) =>
    a.nombreInst.localeCompare(b.nombreInst, undefined, { sensitivity: 'base' })
  );
  activeLetter = null;
  activeTag = null;
  updateDirectoryView();
}

setupLightbox();
loadDirectory().catch((error) => {
  console.error(error);
});
