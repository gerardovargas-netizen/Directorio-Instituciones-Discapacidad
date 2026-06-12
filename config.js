const APP_ORIGIN = (() => {
  if (window.location.protocol === 'file:') {
    return 'http://127.0.0.1:8000';
  }

  if (window.location.port && window.location.port !== '8000') {
    return 'http://127.0.0.1:8000';
  }

  return '';
})();

const CSV_PATH = `${APP_ORIGIN}/dir_inst_apoyo.csv`;
const API_ENTRIES_URL = `${APP_ORIGIN}/api/entries`;
const API_HEALTH_URL = `${APP_ORIGIN}/api/health`;
