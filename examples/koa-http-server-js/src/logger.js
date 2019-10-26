import * as store from '@leapfrogtechnology/async-store';

/**
 * Get unique request id from store or return empty string.
 *
 * @returns {string}
 */
function getRequestId() {
  return (store.getId() || '').substring(0, 8);
}

/**
 * Print log message to the stdout / stderr.
 *
 * @param {string} level
 * @param {string} message
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  const requestId = getRequestId();
  const line = `${timestamp} [ ${level} ] ${requestId ? `${requestId} - ` : ''}${message}\n`;

  if (level === 'ERROR') {
    process.stderr.write(line);

    return;
  }

  process.stdout.write(line);
}

/**
 * Write info logs and associated request id to stdout.
 *
 * @param {string} message
 */
export function info(message) {
  log('INFO', message);
}

/**
 * Write debug logs and associated request id to stdout.
 *
 * @param {string} message
 */
export function debug(message) {
  log('DEBUG', message);
}

/**
 * Write error logs and associated request id to stdout.
 *
 * @param {any} err
 */
export function error(err) {
  log('ERROR', err);
}
