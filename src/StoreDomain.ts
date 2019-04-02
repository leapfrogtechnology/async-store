import { Domain } from 'domain';

export const ID_KEY = '__$id__';
export const STORE_KEY = '__$store__';

/**
 * The custom domain type with the store.
 */
interface StoreDomain extends Domain {
  [STORE_KEY]?: any;
  [ID_KEY]?: string;
}

export default StoreDomain;
