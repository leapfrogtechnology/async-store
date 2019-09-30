import AsyncStoreParams from './AsyncStoreParams';

/**
 * Async Store implementation contract.
 */
interface AsyncStore {
  initialize: (callback: (err?: any) => void, params?: AsyncStoreParams) => void;
  set: (properties: any) => void;
  get: (key: string) => any;
  getByKeys: (keys: string[]) => any;
  find: (key: string) => any;
  isInitialized: () => boolean;
  getId: (short: boolean) => string | undefined;
}

export default AsyncStore;
