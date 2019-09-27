import { URL } from 'url';
import { IncomingMessage, ServerResponse } from 'http';

import error404 from './error404';
import * as logger from './logger';
import { toFullURL } from './utils';
import queryToStore from './queryToStore';
import routes, { Controller } from './routes';

/**
 * Main application router
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export default function router(req: IncomingMessage, res: ServerResponse) {
  const url: URL = toFullURL(req.url || '');
  const controller: Controller | null = routes(url.pathname);

  logger.info(`Received a request at url: ${url.pathname}`);

  if (!controller) {
    error404(req, res);

    return;
  }

  queryToStore(url.searchParams);

  controller(req, res);
}
