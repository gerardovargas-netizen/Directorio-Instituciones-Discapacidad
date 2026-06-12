const CSV_PATH = 'dir_inst_apoyo.csv';
const API_ENTRIES_URL = 'api/entries';
const API_HEALTH_URL = 'api/health';

const IS_LOCAL_SERVER =
  window.location.protocol === 'file:' ||
  ((window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1') &&
    window.location.port === '8000');
