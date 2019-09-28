import * as express from 'express';
import { Request, Response } from 'express';

import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { storeParams, add } from './middlewares';

const app = express();
const port = process.env.PORT || 3000;

app.use(store.initializeMiddleware());
app.use(storeParams());

app.get('/', add(), (req: Request, res: Response) => {
  const a = store.get('a');
  const b = store.get('b');
  const sum = store.get('sum');

  res.send(`Sum of ${a}, ${b}: ${sum}\n`);
  logger.info('Response sent');
});

app.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}!\n`);
});
