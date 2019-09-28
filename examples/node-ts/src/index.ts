import * as http from 'http';
import * as store from '@leapfrogtechnology/async-store';
import AsyncStoreAdapter from '@leapfrogtechnology/async-store/dist/AsyncStoreAdapter';

import * as logger from './logger';
import { requestParams, add } from './middlewares';

export const PORT = process.env.PORT || 8000;
export const BASE_URL = `http://localhost:${PORT}`;

/**
 * Main application router
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function router(req: http.IncomingMessage, res: http.ServerResponse) {
  const params = (req.url || '').split('?', 2)[1];

  store.set({ query: params });

  requestParams(req, res);
  add(req, res);
}

const app = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const init = store.initialize(AsyncStoreAdapter.DOMAIN);

  init(() => router(req, res), { req, res, error: logger.error });
});

app.listen(PORT, () => {
  logger.info(`Server listening at ${BASE_URL}..\n\n`);
});
