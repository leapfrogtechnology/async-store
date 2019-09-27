import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';

/**
 * A example service that says hi to the
 * name specified in query key of async-store.
 *
 * @returns {string}
 */
export function sayHi() {
  const name = store.get('query').name;
  const hiText = `Hi! ${name}`;

  logger.debug(hiText);

  return hiText;
}
