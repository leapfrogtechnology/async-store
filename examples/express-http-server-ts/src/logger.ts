import * as store from '@leapfrogtechnology/async-store';

/**
 * Get unique request id from store or return empty string.
 *
 * @returns {string}
 */
function getRequestId(): string {
  return (store.getId() || '').substring(0, 8);
}

/**
 * Print log message to the stdout / stderr.
 *
 * @param {string} level
 * @param {string} requestId
 * @param {string} message
 */
function log(level: string, requestId: string, message: string) {
  const timestamp = new Date().toISOString();
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
export function info(message: string) {
  const requestId = getRequestId();

  log('INFO', requestId, message);
}

/**
 * Write debug logs and associated request id to stdout.
 *
 * @param {string} message
 */
export function debug(message: string) {
  const requestId = getRequestId();

  log('DEBUG', requestId, message);
}

/**
 * Write error logs and associated request id to stdout.
 *
 * @param {any} err
 */
export function error(err: any) {
  const requestId = getRequestId();

  log('ERROR', requestId, err);
}
