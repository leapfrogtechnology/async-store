import * as logger from './logger';

/**
 * An example function making use of the request context set in the store.
 */
export function doSomething() {
  // Do something with the request.
  logger.info('Simulating delay');

  setTimeout(() => {
    logger.info('Delay end');
  }, 2000);
}
