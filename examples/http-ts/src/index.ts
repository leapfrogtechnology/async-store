import * as http from 'http';
import * as store from '@leapfrogtechnology/async-store';
import AsyncStoreAdapter from '@leapfrogtechnology/async-store/dist/AsyncStoreAdapter';

import * as logger from './logger';

const PORT = 8000;

const app = http.createServer((req, res) => {
  store.initialize(AsyncStoreAdapter.DOMAIN)(() => {
    logger.debug(`Received a request at url: ${req.url}`);

    res.statusCode = 200;
    res.write(`Hello, World`);
    res.end();
  });
});

app.listen(PORT, () => {
  logger.info(`Server listening at ${PORT}..\n\n`);
});
