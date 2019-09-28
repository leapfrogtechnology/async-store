import * as qs from 'qs';
import { ServerResponse, IncomingMessage } from 'http';

import * as store from '@leapfrogtechnology/async-store';
import AsyncStoreAdapter from '@leapfrogtechnology/async-store/dist/AsyncStoreAdapter';

import * as logger from './logger';
import { doSomethingAsync } from './service';

/**
 * Listener function for the incoming http requests.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function initializeApp(req: IncomingMessage, res: ServerResponse) {
  const initStore = store.initialize(AsyncStoreAdapter.DOMAIN);

  initStore(() => handleRequest(req, res), { req, res, error: logger.error });
}

/**
 * Handle incoming http request.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const params = (req.url || '').split('?', 2)[1];

  store.set({ query: params });

  storeParams(req, res);
  add(req, res);
}

/**
 * Set input params received from query in the store.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function storeParams(req: IncomingMessage, res: ServerResponse) {
  const { a, b } = qs.parse(store.get('query'));

  store.set({ a, b });

  logger.debug(`Persisted a: ${a}`);
  logger.debug(`Persisted b: ${b}`);
}

/**
 * Middleware to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function add(req: IncomingMessage, res: ServerResponse) {
  doSomethingAsync();

  const a = +store.get('a');
  const b = +store.get('b');

  const sum = a + b;

  logger.debug(`Calculated sum: ${sum}`);

  store.set({ sum });
  logger.debug(`Persisted sum: ${sum}`);

  res.write(`Sum of ${a}, ${b} = ${sum}\n`);
  res.end();
  logger.info('Response sent');
}
