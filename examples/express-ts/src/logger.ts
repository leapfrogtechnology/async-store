import * as store from '@leapfrogtechnology/async-store';

/**
 * A example service to log info with unique request id
 *
 * @param {string} infoText
 */
export function info(infoText: string) {
  const requestId = store.getId();

  process.stdout.write(`[ INFO ] [ ${requestId} ] ${infoText}`);
}
