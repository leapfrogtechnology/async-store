import { IncomingMessage, ServerResponse } from 'http';
import * as store from '@leapfrogtechnology/async-store';

import { sayHi } from './service';
import * as logger from './logger';

/**
 * Controller for `/home` endpoint.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function home(req: IncomingMessage, res: ServerResponse): void {
  logger.info('Home controller called.');

  res.write('<h1>Home</h1>');
  res.write(`<p>${sayHi()}</p>`);
  res.end();
}

/**
 * Controller for `/other` endpoint.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function other(req: IncomingMessage, res: ServerResponse): void {
  logger.info('Other controller called.');

  const someData: string = store.get('query').someData;

  res.write('<h1>Other</h1>');
  res.write(`<p>Some data: ${someData}</p>`);
  res.end();
}
