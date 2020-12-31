import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';

/**
 * An example function making use of the request context
 * set in the store asynchronously (with delay).
 */
export function doSomethingAsync() {
  // Do something with the request with a delay.
  logger.debug('Simulating delayed access');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = store.getAll();
      logger.info('Store contents: ' + JSON.stringify(data));
      resolve(null);
    }, 2000);
  });
}
