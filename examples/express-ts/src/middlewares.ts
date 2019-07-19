import * as store from '@leapfrogtechnology/async-store';
import { Request, Response, NextFunction } from 'express';

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
  const xId = store.get('x-id');

  console.log('X-id received in the middleware:', xId); // tslint:disable-line

  next();
}
