import { IncomingMessage, ServerResponse } from 'http';

import * as logger from './logger';

/**
 * Simple 404 error handler.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export default function(req: IncomingMessage, res: ServerResponse): void {
  const url = req.url;

  logger.debug(`404 encountered at: ${url}`);

  res.write('<h1>404 Page not found</h1>');
  res.write(`<p>The page at '${url}' was not found.</p>`);
  res.end();
}
