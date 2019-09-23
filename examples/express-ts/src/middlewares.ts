import * as store from '@leapfrogtechnology/async-store';
import { Request, Response, NextFunction } from 'express';

import * as logger from './logger';

/**
 * Middleware to set query params `a` and `b` on async-store
 *
 * @returns {(req, res, next) => void}
 */
export function requestParams() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const a = req.query.a;
    const b = req.query.b;

    store.set({
      a: parseFloat(a) || 0,
      b: parseFloat(b) || 0
    });

    logger.debug(`Received a: ${a}`);
    logger.debug(`Received b: ${b}`);

    next();
  };
}

/**
 * Middleware to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @returns {(req, res, next) => void}
 */
export function add() {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info('Simulating Delay');
    setTimeout(() => {
      const a = store.get('a');
      const b = store.get('b');

      const sum = a + b;

      store.set({ sum });
      logger.debug(`Calculated sum: ${sum}`);

      next();
    }, 2000);
  };
}

/**
 * Middleware to set the request context `x-id` on the async store.
 *
 * @returns {(req, res, next) => void}
 */
export function requestContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    store.set({ 'x-id': req.header('x-id') });

    next();
  };
}

/**
 * Middleware where the value set in the store is available for use.
 *
 * @returns {(req, res, next) => void}
 */
export function otherMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = store.get('x-id');

  logger.info(`X-Id received in the middleware: ${requestId}\n`);

  next();
}
