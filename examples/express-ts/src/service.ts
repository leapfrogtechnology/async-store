import * as store from '@leapfrogtechnology/async-store';

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

  process.stdout.write(`Request context: ${requestId}\n`);
}
