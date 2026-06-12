const CMS_FIELDS = [
  { name: 'nombreInst', label: 'Nombre de la institución' },
  { name: 'numTel', label: 'Número de teléfono' },
  { name: 'dirCompleta', label: 'Dirección completa' },
  { name: 'sitioWeb', label: 'Sitio Web' },
  { name: 'mail', label: 'Correo electrónico' },
  { name: 'enlaceContacto', label: 'Enlace a formulario de contacto o informes' },
  { name: 'nombreServicio', label: 'Nombre del servicio' },
  { name: 'objetivoServicio', label: 'Objetivo del servicio' },
  { name: 'poblacionMeta', label: 'Población meta' },
  { name: 'reglasOperServicio', label: 'Reglas de operación del servicio' },
  { name: 'procesoSolicApoyo', label: 'Explicación breve para solicitar el servicio' },
  { name: 'etiquetas', label: 'Etiquetas' },
];

const SERVER_HELP_MESSAGE =
  'No se pudo conectar con el servidor. En la carpeta del proyecto ejecuta: python3 server.py y abre http://localhost:8000';

function buildCMSForm() {
  const form = document.getElementById('cms-form');

  CMS_FIELDS.forEach(({ name, label }) => {
    const row = document.createElement('div');
    row.className = 'cms-form__row';

    const labelElement = document.createElement('label');
    labelElement.className = 'cms-form__label';
    labelElement.htmlFor = name;
    labelElement.textContent = label;

    const input = document.createElement('input');
    input.className = 'cms-form__input';
    input.type = 'text';
    input.id = name;
    input.name = name;

    row.appendChild(labelElement);
    row.appendChild(input);
    form.insertBefore(row, form.querySelector('.cms-form__actions'));
  });
}

function setupCMSAccordion() {
  const toggle = document.getElementById('cms-toggle');
  const panel = document.getElementById('cms-form-panel');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('cms-form-panel--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

async function checkCMSServer() {
  const status = document.getElementById('cms-status');

  try {
    const response = await fetch(API_HEALTH_URL);

    if (!response.ok) {
      throw new Error();
    }

    status.textContent = '';
  } catch (error) {
    status.textContent = SERVER_HELP_MESSAGE;
  }
}

async function submitEntry(data) {
  const response = await fetch(API_ENTRIES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = 'No se pudo guardar la información.';

    try {
      const payload = await response.json();
      if (payload.error) {
        message = payload.error;
      }
    } catch (error) {
      if (response.status === 501) {
        message = SERVER_HELP_MESSAGE;
      }
    }

    throw new Error(message);
  }
}

async function handleCMSSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById('cms-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());

  submitButton.disabled = true;
  status.textContent = '';

  try {
    await submitEntry(data);
    form.reset();
    status.textContent = 'Datos guardados correctamente.';

    try {
      await loadDirectory();
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    status.textContent =
      error instanceof TypeError ? SERVER_HELP_MESSAGE : error.message;
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
}

buildCMSForm();
setupCMSAccordion();
checkCMSServer();
document.getElementById('cms-form').addEventListener('submit', handleCMSSubmit);
