import * as logger from './logger';

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {void}
 */
export function doSomething() {
  // Do something with the request.
  logger.info('Simulating Delay');

  setTimeout(() => {
    logger.info('Delay end.');
  }, 2000);
}
