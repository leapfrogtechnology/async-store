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
 * @param {string} infoText
 */
export function info(infoText: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ INFO ] ${requestId ? `[ ${requestId} ]` : ''} ${infoText}\n`);
}

/**
 * Write debug logs and associated request id to stdout.
 *
 * @param {string} debugText
 */
export function debug(debugText: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ DEBUG ] ${requestId ? `[ ${requestId} ]` : ''} ${debugText}\n`);
}
