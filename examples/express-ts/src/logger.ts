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
 * A example service to log info with unique request id.
 *
 * @param {string} infoText
 */
export function info(infoText: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ INFO ] ${requestId ? `[ ${requestId} ]` : ''} ${infoText}\n`);
}

/**
 * A example service to log debug with unique request id.
 *
 * @param {string} debugText
 */
export function debug(debugText: string) {
  const requestId = getRequestId();

  process.stdout.write(`[ DEBUG ] ${requestId ? `[ ${requestId} ]` : ''} ${debugText}\n`);
}
