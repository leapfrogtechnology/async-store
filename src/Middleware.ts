import { Request, Response, NextFunction } from 'express';

/**
 * Signature for a middleware function.
 */
type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

export default Middleware;
