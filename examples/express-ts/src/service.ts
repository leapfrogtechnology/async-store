import * as logger from './logger';

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {Promise<void>}
 */
export async function doSomething() {
  // Do something with the request.

  setTimeout(() => {
    logger.info('Delay end.');
  }, 2000);
}
