import * as store from '@leapfrogtechnology/async-store';
import * as logger from './logger';

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {Promise<void>}
 */
export async function doSomething() {
  // Do something with the request.

  await Promise.all([() => logRequestContext()]);
}

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {Promise<void>}
 */
async function logRequestContext() {
  const requestId = store.get('x-id');

  logger.info(`Request context: ${requestId}\n`);
}
