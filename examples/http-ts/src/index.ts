import * as http from 'http';
import * as store from '@leapfrogtechnology/async-store';
import AsyncStoreAdapter from '@leapfrogtechnology/async-store/dist/AsyncStoreAdapter';

import router from './router';
import * as logger from './logger';
import { BASE_URL, PORT } from './config';

const app = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const storeContext = store.initialize(AsyncStoreAdapter.DOMAIN);

  storeContext(() => router(req, res), { req, res, error: logger.error });
});

app.listen(PORT, () => {
  logger.info(`Server listening at ${BASE_URL}..\n\n`);
});
