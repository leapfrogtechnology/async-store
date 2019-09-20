import * as store from '@leapfrogtechnology/async-store';

/**
 * A example service to log info with unique request id
 *
 * @param infoText Text to log
 */
export function info(infoText: string) {
  const requestId = store.getId();

  process.stdout.write(`[ INFO ] [ ${requestId} ] ${infoText}`);
}
