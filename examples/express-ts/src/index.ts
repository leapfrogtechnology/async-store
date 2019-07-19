import * as express from 'express';
import { Request, Response } from 'express';

import * as store from '@leapfrogtechnology/async-store';

import * as service from './service';
import { requestContext, otherMiddleware } from './middlewares';

const app = express();
const port = 3000;

app.use(store.initializeMiddleware());
app.use(requestContext());

app.get('/', otherMiddleware, async (req: Request, res: Response) => {
  await service.doSomething();

  const requestId = store.get('x-id');

  res.send(`Response to request: ${requestId}\n`);
});

app.listen(port, () => {
  process.stdout.write(`Express server listening on port ${port}!\n`);
});
