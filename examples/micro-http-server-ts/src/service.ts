import * as qs from "qs";
import * as logger from "./logger";

import * as store from "@leapfrogtechnology/async-store";

/**
 * Set input params received from query in the store.
 *
 * @param {any} query
 */
export function storeParams(query:any) {
  const { a, b } = qs.parse(query);

  store.set({ a, b });

  logger.debug(`Persisted a: ${a}`);
  logger.debug(`Persisted b: ${b}`);
}

/**
 * An example function making use of the request context
 * set in the store asynchronously (with delay).
 */
export function doSomethingAsync() {
  // Do something with the request with a delay.
  logger.debug("Simulating delayed access");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = store.getAll();
      logger.info("Store contents: "+ JSON.stringify(data));
      resolve();
    }, 2000);
  });
}




