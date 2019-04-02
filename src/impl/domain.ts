import * as debug from 'debug';
import * as domain from 'domain';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { mergeDeepRight } from 'ramda'; // TODO: Import merge function only.

import { STORE_DOMAIN } from '../constants';
import StoreDomain, { STORE_KEY, ID_KEY } from '../StoreDomain';

const logDomain = debug(STORE_DOMAIN);

/**
 * Initialize the store domain and enable
 * all the async middelwares / callacks triggered
 * via the provided callback to have access to the store.
 *
 * @param {() => void} callback               Callback function to trigger once domain is initialized
 * @param {(...args: any[]) => void} [error]  Error handler to listen for the error even
 * @param {EventEmitter[]}  [emitters]        Emitters to add to the domain
 */
export function initialize(callback: () => void, error?: (...args: any[]) => void, emitters?: EventEmitter[]) {
  const d = createOrUseActiveDomain(error, emitters);

  logDomain(`Adding ${STORE_KEY} and ${ID_KEY} in domain store`);

  // Initialize the context in the domain.
  d[STORE_KEY] = {};
  d[ID_KEY] = uuidv4();

  if (isDomainInitialized()) {
    callback();

    return;
  }

  d.run(callback);
}

/**
 * Create or use active domain. If domain is already intialized in application it uses existing
 * domain else create new domain object.
 *
 * @param {(...args: any[]) => void} [error]  Error handler to listen for the error even
 * @param {EventEmitter[]}  [emitters]        Emitters to add to the domain
 */
function createOrUseActiveDomain(error?: (...args: any[]) => void, emitters?: EventEmitter[]): StoreDomain {
  if (isDomainInitialized()) {
    logDomain(`Using active domain.`);

    return getActiveDomain();
  }

  logDomain(`Creating new domain.`);

  const d = domain.create();

  logDomain(`Binding emitters.`);
  if (Array.isArray(emitters)) {
    emitters.forEach(emitter => d.add(emitter));
  }

  if (error) {
    d.on('error', error);
  }

  return d;
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
 * Get a value by a key from the store.
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
 * @param {*} store
 * @param {*} properties
 */
function updateStore(store: any, properties: any) {
  const activeDomain = getActiveDomain();

  if (!activeDomain) {
    throw new Error('No active domain found in store.');
  }

  const data = mergeDeepRight(store, properties);

  logDomain(`Updating store`);

  activeDomain[STORE_KEY] = data;
}

/**
 * Get the active domain.
 *
 * @returns {StoreDomain}
 */
function getActiveDomain(): StoreDomain {
  return process.domain as StoreDomain;
}

/**
 * Get's the unique domain id created for the current context / scope.
 *
 * @returns {(string | undefined)}
 */
export function getId(): string | undefined {
  const activeDomain = getActiveDomain();

  return activeDomain && activeDomain[ID_KEY];
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
