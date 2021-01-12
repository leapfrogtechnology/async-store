import { EventEmitter } from 'events';

/**
 * Async Store adapter types.
 */
export enum AsyncStoreAdapter {
  DOMAIN = 'domain'

  // Later we can add other implementations of the store as a new adapter,
  // for instance, add: ASYNC_HOOKS = 'async_hooks'
  // and create implementation for async hooks as per the API requirements.
}

/**
 * Async Store implementation contract.
 */
export interface AsyncStore {
  initialize: (callback: (err?: any) => void, params?: AsyncStoreParams) => void;
  set: (properties: any) => void;
  get: (key: string) => any;
  getAll: () => any;
  getByKeys: (keys: string[]) => any;
  find: (key: string) => any;
  isInitialized: () => boolean;
  getId: () => string | undefined;
  getShortId: () => string | undefined;
}

/**
 * Async Store params interface.
 */
export interface AsyncStoreParams {
  req?: any;
  res?: any;
  emitters?: EventEmitter[];
  error?: (...args: any[]) => void;
}
