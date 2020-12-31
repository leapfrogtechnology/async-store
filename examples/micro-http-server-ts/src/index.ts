import * as http from 'http';
import micro from 'micro';
import { IncomingMessage, ServerResponse } from 'http';

import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { storeParams, calculateSum } from './middlewares';

const PORT = 3000;

const server = new http.Server(
  micro((req: IncomingMessage, res: ServerResponse) => {
    store.initialize()(() => {
      storeParams((req.url || '').split('?', 2)[1]);
      calculateSum(req, res);
      handleRequest(req, res);
    });
  })
);

server.listen(PORT, () => {
  logger.info(`HTTP server listening on port ${PORT}!\n`);
});

/**
 * Handle incoming http request.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const a = store.get('a');
  const b = store.get('b');
  const sum = store.get('sum');
  res.write(`Sum of ${a}, ${b} = ${sum}\n`);
  res.end();
  logger.info('Response sent');
}
