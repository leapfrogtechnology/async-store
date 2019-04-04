import { EventEmitter } from 'events';

/**
 * Async Store implementation contract.
 */
interface AsyncStore {
  initialize: (callback: () => void, error?: (...args: any[]) => void, emitters?: EventEmitter[]) => void;
  set: (properties: any) => void;
  get: (key: string) => any;
  isInitialized: () => boolean;
  getId: () => string | undefined;
}

export default AsyncStore;
