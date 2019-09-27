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
 * Write info logs and associated request id to stdout.
 *
 * @param {string} text
 */
export function info(text: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ INFO  ] ${requestId ? `[ ${requestId} ]` : ''} ${text}\n`);
}

/**
 * Write debug logs and associated request id to stdout.
 *
 * @param {string} text
 */
export function debug(text: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ DEBUG ] ${requestId ? `[ ${requestId} ]` : ''} ${text}\n`);
}

/**
 * Write error logs and associated request id to stdout.
 *
 * @param {any} err
 */
export function error(err: any) {
  const requestId = getRequestId();

  process.stdout.write(`[ ERROR ] ${requestId ? `[ ${requestId} ]` : ''} ${err}\n`);
}
