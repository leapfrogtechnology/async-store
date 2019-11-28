import * as qs from 'qs';
import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';

/**
 * Set input params received from query in the store.
 *
 * @param {string} query
 */
export function storeParams(query: string) {
  const { a, b } = qs.parse(query);

  store.set({ a, b });

  logger.debug(`Persisted a: ${a}`);
  logger.debug(`Persisted b: ${b}`);
}

/**
 * An example function making use of the request context
 * set in the store asynchronously (with delay).
 *
 * @returns {Promise<any>}
 */
export function doSomethingAsync(): Promise<any> {
  // Do something with the request with a delay.
  logger.debug('Simulating delayed access');

  return new Promise(resolve => {
    setTimeout(() => {
      const data = store.getAll();
      logger.info('Store contents: ' + JSON.stringify(data));
      resolve();
    }, 2000);
  });
}
