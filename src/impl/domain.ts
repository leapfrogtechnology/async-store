import debug from 'debug';
import * as domain from 'domain';
import merge from 'lodash.merge';
import { randomUUID } from 'crypto';

import { STORE_DOMAIN } from '../constants';
import AsyncStoreParams from '../AsyncStoreParams';
import StoreDomainInterface, { STORE_KEY, ID_KEY } from '../StoreDomain';

const logDomain = debug(STORE_DOMAIN);

/**
 * Initialize the store domain and enable all the async
 * middlewares/callbacks triggered via the provided
 * callback to have access to the store.
 *
 * @param {AsyncStoreParams} params
 */
export function initialize(callback: (err?: any) => void, params?: AsyncStoreParams) {
  const d = createOrUseActiveDomain();

  if (params) {
    bindParams(d, params);
  }

  logDomain(`Adding ${STORE_KEY} and ${ID_KEY} in domain store`);
  // Initialize the context in the domain.
  d[STORE_KEY] = Object.create(null);
  d[ID_KEY] = randomUUID();

  return d.run(callback);
}

/**
 * Bind async store params and error event listener in domain.
 *
 * @param  {StoreDomainInterface} d
 * @param  {AsyncStoreParams} params
 * @returns {void}
 */
function bindParams(d: StoreDomainInterface, params: AsyncStoreParams): void {
  const { req, res, error, emitters } = params;

  logDomain('Binding req and res.');
  if (req && res) {
    d.add(req);
    d.add(res);
  }

  logDomain(`Binding emitters.`);
  if (emitters && Array.isArray(emitters)) {
    emitters.forEach((emitter) => d.add(emitter));
  }

  if (error) {
    d.on('error', error);
  }
}

/**
 * Create or use active domain. If domain is already initialized
 * in application it uses existing domain else create new
 * domain object.
 *
 * @returns {StoreDomainInterface}
 */
function createOrUseActiveDomain(): StoreDomainInterface {
  if (isDomainInitialized()) {
    logDomain(`Using active domain.`);

    // Some packages like Raven (sentry) uses domain to handle exception
    // which might overwrite async store domain.
    // For more information: https://github.com/getsentry/sentry-javascript.
    return getActiveDomain();
  }

  logDomain(`Creating new domain.`);

  return domain.create();
}

/**
 * Sets a <key: value> pair in the store.
 *
 * Example:
 *  set({ key1: 'value1', key2: 'value2' });
 *
 * @param {*} properties
 */
export function set(properties: any) {
  logDomain(`Setting properties in the domain store =`, properties);

  if (properties && typeof properties === 'object') {
    updateStore(getStore(), properties);

    return;
  }

  throw new Error('Invalid arguments provided for asyncStore.set()');
}

/**
 * Reset the store by removing all values or a specific value by key.
 *
 * @param {string} key
 */
export function reset(key?: string) {
  const store = getStore();

  if (key) {
    logDomain(`Resetting ${key} in the domain store.`);

    delete store[key];

    return;
  }

  logDomain('Resetting the domain store.');

  const activeDomain = getActiveDomain();
  activeDomain[STORE_KEY] = null;
}

/**
 * Get a value by a key from the store.
 * Throws an error if anything fails while getting the value.
 *
 * @param {string} key
 * @returns {*}
 */
export function get(key: string): any {
  const store = getStore();

  if (!store) {
    return null;
  }

  logDomain(`Value of ${key} in the domain store =`, store[key]);

  return store[key];
}

/**
 * Get all values from the store.
 * Throws an error if anything fails while getting values.
 *
 * @returns {*}
 */
export function getAll(): any {
  const store = getStore();

  if (!store) {
    return null;
  }

  logDomain('All values in the store');

  return store;
}

/**
 * Retrieves all values that correspond to a given list of keys.
 * Any keys not found are included in-order as `undefined`.
 *
 * Example:
 *  const a = 1;
 *  const b = 2;
 *  const sum = a + b;
 *  store.set({ a, b, sum })
 *
 *  const results = store.getByKeys(['a', 'b', 'other', 'sum']); // [1, 2, undefined, 3]
 *
 * @param {string[]} keys
 * @returns {T[]}
 */
export function getByKeys<T>(keys: string[]): T[] {
  if (!(keys && keys.length > 0)) {
    throw new Error('No keys provided for getting the values from store.');
  }

  return keys.map((key) => get(key));
}

/**
 * Get a value by a key from the store.
 * If anything fails, it returns null without emitting error event.
 *
 * @param {string} key
 * @returns {*}
 */
export function find(key: string): any {
  try {
    return get(key);
  } catch (err) {
    logDomain(`Error finding ${key} in store:`, err);

    return null;
  }
}

/**
 * Check if the domain has been initialized or not.
 *
 * @returns {boolean}
 */
function isDomainInitialized(): boolean {
  return !!getActiveDomain();
}

/**
 * Check if the store has been initialized in the active domain.
 *
 * @returns {boolean}
 */
export function isInitialized(): boolean {
  const activeDomain = getActiveDomain();

  return !!(activeDomain && activeDomain[STORE_KEY]);
}

/**
 * Add (or override) properties to the given store (mutates the central store object).
 *
 * @param {StoreDomainInterface} store
 * @param {*} properties
 */
function updateStore(store: StoreDomainInterface, properties: any) {
  const activeDomain = getActiveDomain();

  const data = merge(store, properties);

  logDomain('Updating store.');

  activeDomain[STORE_KEY] = data;
}

/**
 * Get the active domain.
 *
 * @returns {StoreDomainInterface}
 */
export function getActiveDomain(): StoreDomainInterface {
  logDomain('Getting active domain.');

  return process.domain as StoreDomainInterface;
}

/**
 * Gets the unique domain id created for the current context / scope.
 *
 * @returns {(string | undefined)}
 */
export function getId(): string | undefined {
  const activeDomain = getActiveDomain();

  return activeDomain && activeDomain[ID_KEY];
}

/**
 * Gets the short unique domain id created for the current context / scope.
 *
 * Note: This is same as `getId();` the difference being it only returns the first 8 characters.
 *
 * @returns {(string | undefined)}
 */
export function getShortId(): string | undefined {
  const id = getId();

  return id && id.substring(0, 8);
}

/**
 * Get the store from the active domain.
 *
 * @returns {*}
 */
function getStore(): any {
  const activeDomain = getActiveDomain();

  if (!activeDomain) {
    throw new Error('No active domain found in store.');
  }

  return activeDomain[STORE_KEY];
}
