import * as http from 'http';

import * as logger from './logger';
import { initializeApp } from './middlewares';

const port = process.env.PORT || 3000;

const app = http.createServer(initializeApp);

app.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}!\n`);
});
