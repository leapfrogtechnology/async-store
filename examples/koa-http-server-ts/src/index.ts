import * as Koa from 'koa';
import { Context } from 'koa';
import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { storeParams, calculateSum } from './middlewares';

const app = new Koa();

const port = process.env.PORT || 3000;

app.use((ctx: Context) => {
  store.initialize()(() => {
    storeParams(ctx);
    calculateSum();
    handleRequest(ctx);
  });
});

app.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}!\n`);
});

/**
 * Handle incoming request.
 *
 * @param {Context} ctx
 */
function handleRequest(ctx: Context) {
  const a = store.get('a');
  const b = store.get('b');
  const sum = store.get('sum');

  ctx.body = `Sum of ${a}, ${b} = ${sum}\n`;
  logger.info('Response sent');
}
