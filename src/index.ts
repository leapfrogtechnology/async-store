import * as debug from 'debug';
import { Request, Response, NextFunction } from 'express';

import AsyncStore from './AsyncStore';
import { STORE_CORE } from './constants';
import AsyncStoreParams from './AsyncStoreParams';
import AsyncStoreAdapter from './AsyncStoreAdapter';

// Implementations of Async store.
import * as domainImplementation from './impl/domain';

const coreLog = debug(STORE_CORE);

/**
 * This variable is to check whether store is enabled or not. Since, Async Store is initialized
 * only when request is made.
 *
 * Note: By default it is disabled and is enabled when isEnabled() is invoked.
 */
let isStoreEnabled = false;

/**
 * The adapter which was used to initialize the store. The value
 * is set when this is initialized the first time.
 *
 * Note: There could be only one single, centralized store so,
 * once initialized the store cannot be re-initialized.
 */
let initializedAdapter: AsyncStoreAdapter;

/**
 * Middleware to initialize the async store and make it
 * accessible from all the subsequent middlewares or
 * async operations triggered afterwards.
 *
 * @param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]
 * @returns {(req, res, next) => void}
 */
export function initializeMiddleware(adapter: AsyncStoreAdapter = AsyncStoreAdapter.DOMAIN) {
  return (req: Request, res: Response, next: NextFunction) => {
    // If the store has already been initialized, ignore it.

    if (isInitialized()) {
      coreLog(`Store is already initialized.`);

      return next();
    }

    const errorHandler = (err: any) => {
      coreLog('Async Store Error: %s', err);

      next(err);
    };

    const params = {
      req,
      res,
      error: errorHandler
    };

    coreLog(`Initializing async store middleware.`);

    initialize(adapter)(next, params);
  };
}

/**
 * Set the store as enabled (by default it's not).
 *
 * @return void
 */
export function enable(): void {
  coreLog('Enabling the async store.');

  isStoreEnabled = true;
}

/**
 * Check if the stored is enabled.
 *
 * @returns {boolean}
 */
export function isEnabled(): boolean {
  coreLog(`Async Store enable status =`, isStoreEnabled);

  return isStoreEnabled;
}

/**
 * Initialize the async store based on the adapter provided.
 *
 * @param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]
 * @returns {(params: AsyncStoreParams) => void}
 */
export function initialize(adapter: AsyncStoreAdapter = AsyncStoreAdapter.DOMAIN) {
  if (isInitialized()) {
    throw new Error('Async store already initialized, cannot re-initialize again.');
  }

  const instance = getInstance(adapter);

  return (callback: (err?: any) => void, params?: AsyncStoreParams) => {
    initializedAdapter = adapter;

    instance.initialize(callback, params);
  };
}

/**
 * Sets properties in the store.
 *
 * Example:
 *  set({ key1: 'value1', key2: 'value2' });
 *
 * @param {*} properties
 */
export function set(properties: any) {
  if (!isInitialized()) {
    throw new Error('Async store not initialized.');
  }

  coreLog(`Setting properties in store =`, properties);

  getInstance(initializedAdapter).set(properties);
}

/**
 * Get a value by a key from the store.
 *
 * @param {string} key
 * @returns {*}
 */
export function get(key: string): any {
  coreLog(`Getting ${key} from the store`);

  return initializedAdapter && getInstance(initializedAdapter).get(key);
}

/**
 * Retrieves all values that correspond to a given list of keys.
 *
 * Example:
 *  const a = 1;
 *  const b = 2;
 *  const sum = a + b;
 *  store.set({a, b, sum})
 *  const results = store.getByKeys(['a', 'b', 'sum']); // {a: 1, b: 2, sum: 3}
 *
 * @param {Array<string>} keys
 * @returns {*}
 */
export function getByKeys(keys: string[]): any {
  coreLog(`Getting ${keys.join(', ')} from the store`);

  return initializedAdapter && getInstance(initializedAdapter).getByKeys(keys);
}

/**
 * Get a value by a key from the store.
 * If error, it returns null without emitting error event.
 *
 * @param {string} key
 * @returns {*}
 */
export function find(key: string): any {
  coreLog(`Finding ${key} in the store`);

  return initializedAdapter && getInstance(initializedAdapter).find(key);
}

/**
 * Check if the store has been initialized.
 *
 * @returns {boolean}
 */
export function isInitialized(): boolean {
  return !!(initializedAdapter && getInstance(initializedAdapter).isInitialized());
}

/**
 * Get's the unique domain id created for the current context / scope.
 *
 * @returns {(string | undefined)}
 */
export function getId(): string | undefined {
  return initializedAdapter && getInstance(initializedAdapter).getId();
}

/**
 * Get the adapter instance based on adapter type.
 *
 * @param {AsyncStoreAdapter} adapter
 * @returns {AsyncStore}
 */
function getInstance(adapter: AsyncStoreAdapter): AsyncStore {
  switch (adapter) {
    case AsyncStoreAdapter.DOMAIN:
      return domainImplementation;

    default:
      throw new Error(`Invalid async store adapter provided ${adapter}.`);
  }
}
