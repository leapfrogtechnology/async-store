import * as qs from 'qs';
import { ServerResponse, IncomingMessage } from 'http';
import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { doSomething } from './service';

export type Middleware = (req: IncomingMessage, res: ServerResponse) => void;

/**
 * Middleware to log query params `a` and `b`
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
