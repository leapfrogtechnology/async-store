import * as store from '@leapfrogtechnology/async-store';

/**
 * An example function making use of the request context
 * set in the store asynchronously (with delay).
 */
export function doSomethingAsync() {
  // Do something with the request with a delay.

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = store.getAll();
      resolve(data);
    }, 2000);
  });
}
