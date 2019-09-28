import * as express from 'express';
import { Request, Response } from 'express';

import * as store from '@leapfrogtechnology/async-store';

import * as logger from './logger';
import { requestParams, add } from './middlewares';

const app = express();
const port = 3000;

app.use(store.initializeMiddleware());
app.use(requestParams());

app.get('/', add(), (req: Request, res: Response) => {
  const a = store.get('a');
  const b = store.get('b');
  const sum = store.get('sum');

  res.send(`Sum of ${a}, ${b}: ${sum}\n`);
});

app.listen(port, () => {
  logger.info(`Express server listening on port ${port}!\n`);
});
