import * as qs from 'qs';
import { ServerResponse, IncomingMessage } from 'http';

import * as store from '@leapfrogtechnology/async-store';
import AsyncStoreAdapter from '@leapfrogtechnology/async-store/dist/AsyncStoreAdapter';

import * as logger from './logger';
import { doSomething } from './service';

export type Middleware = (req: IncomingMessage, res: ServerResponse) => void;

/**
 * Handle incoming http request.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const params = (req.url || '').split('?', 2)[1];

  store.set({ query: params });

  requestParams(req, res);
  add(req, res);
}

/**
 * Listener function for the incoming http requests.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function initializeApp(req: IncomingMessage, res: ServerResponse) {
  const init = store.initialize(AsyncStoreAdapter.DOMAIN);

  init(() => handleRequest(req, res), { req, res, error: logger.error });
}

/**
 * Middleware to set query params `a` and `b` on async-store.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function requestParams(req: IncomingMessage, res: ServerResponse) {
  const { a, b } = qs.parse(store.get('query'));

  store.set({ a, b });

  logger.debug(`Received a: ${a}`);
  logger.debug(`Received b: ${b}`);
}

/**
 * Middleware to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function add(req: IncomingMessage, res: ServerResponse) {
  doSomething();

  const a: number = +store.get('a');
  const b: number = +store.get('b');

  const sum = a + b;

  store.set({ sum });
  logger.debug(`Calculated sum: ${sum}`);

  res.write(`Sum of ${a}, ${b} = ${sum}\n`);
  res.end();
}
