import * as store from '@leapfrogtechnology/async-store';

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {Promise<void>}
 */
export async function doSomething() {
  console.log('Do something with the request.'); // tslint:disable-line

  await Promise.all([() => logRequestContext()]);
}

/**
 * An example function making use of the request context set in the store.
 *
 * @returns {Promise<void>}
 */
async function logRequestContext() {
  const xId = store.get('x-id');

  console.log('Request context: ', xId); // tslint:disable-line
}
