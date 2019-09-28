import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { storeParams, calculateSum } from './middlewares';

const port = process.env.PORT || 3000;

const app = http.createServer((req, res) =>
  store.initialize()(
    () => {
      storeParams((req.url || '').split('?', 2)[1]);
      calculateSum(req, res);
      handleRequest(req, res);
    },
    { req, res, error: logger.error }
  )
);

app.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}!\n`);
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
