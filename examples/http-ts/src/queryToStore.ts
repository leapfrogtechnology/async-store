import { URLSearchParams } from 'url';
import * as store from '@leapfrogtechnology/async-store';

/**
 * Get the query params from the url and set them to async-store with `query` key.
 *
 * @param {URLSearchParams} url
 */
export default function queryToStore(urlQueryParams: URLSearchParams) {
  const queryKeys: Iterator<string> = urlQueryParams.keys();
  const queryParams: any = {};

  let result: IteratorResult<string, any> = queryKeys.next();
  while (!result.done) {
    const key: string = result.value;
    const value: string[] = urlQueryParams.getAll(key);

    queryParams[key] = value.length === 1 ? value[0] : value;

    result = queryKeys.next();
  }

  store.set({ query: queryParams });
}
