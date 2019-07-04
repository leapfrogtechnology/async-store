import { EventEmitter } from 'events';

/**
 * Async Store params interface.
 */
export interface AsyncStoreParams {
  req?: any;
  res?: any;
  emitters?: EventEmitter[];
  error?: (...args: any[]) => void;
}

export default AsyncStoreParams;
