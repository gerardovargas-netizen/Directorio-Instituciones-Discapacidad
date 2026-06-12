function getBaseUrl() {
  if (window.location.protocol === 'file:') {
    return 'http://127.0.0.1:8000/';
  }

  const url = new URL(window.location.href);

  if (url.pathname.endsWith('/')) {
    return url.href;
  }

  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    url.pathname = url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1);
    return url.href;
  }

  url.pathname += '/';
  return url.href;
}

function assetUrl(relativePath) {
  return new URL(relativePath, getBaseUrl()).href;
}

const IS_LOCAL_SERVER =
  window.location.protocol === 'file:' ||
  ((window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1') &&
    window.location.port === '8000');

const CSV_PATH = assetUrl('dir_inst_apoyo.csv');
const API_ENTRIES_URL = assetUrl('api/entries');
const API_HEALTH_URL = assetUrl('api/health');
