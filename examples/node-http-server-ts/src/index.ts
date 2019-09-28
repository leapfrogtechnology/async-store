import { IncomingMessage, ServerResponse, createServer } from 'http';

import * as logger from './logger';
import { initializeApp } from './middlewares';

export const PORT = process.env.PORT || 3000;
export const BASE_URL = `http://localhost:${PORT}`;

const app = createServer(initializeApp);

app.listen(PORT, () => {
  logger.info(`Server listening at ${BASE_URL}..\n\n`);
});
