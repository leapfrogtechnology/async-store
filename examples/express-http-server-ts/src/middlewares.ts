import * as store from '@leapfrogtechnology/async-store';
import { Request, Response, NextFunction } from 'express';

import * as logger from './logger';
import { doSomethingAsync } from './service';

/**
 * Middleware to set query params `a` and `b` on async-store.
 *
 * @returns {(req, res, next) => void}
 */
export function storeParams() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { a, b } = req.query;

    store.set({ a, b });

    logger.debug(`Persisted a: ${a}`);
    logger.debug(`Persisted b: ${b}`);

    next();
  };
}

/**
 * Middleware to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @returns {(req, res, next) => void}
 */
export function calculateSum() {
  return (req: Request, res: Response, next: NextFunction) => {
    doSomethingAsync();

    const a = +store.get('a');
    const b = +store.get('b');
    const sum = a + b;

    store.set({ sum });
    logger.debug(`Calculated sum: ${sum}`);
    logger.debug(`Persisted sum: ${sum}`);

    next();
  };
}
