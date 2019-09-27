import { IncomingMessage, ServerResponse } from 'http';

import * as controller from './controller';

const HOME_ROUTE = '/home';
const OTHER_ROUTE = '/other';

export type Controller = (req: IncomingMessage, res: ServerResponse) => void;

/**
 * Returns a controller for a path if exists, null otherwise.
 *
 * @param {string} path A path to find controller for.
 * @returns {Controller | null} Controller for path.
 */
export default function(path: string | undefined): Controller | null {
  if (!path) {
    return null;
  }

  switch (path.toLowerCase()) {
    case HOME_ROUTE:
      return controller.home;
    case OTHER_ROUTE:
      return controller.other;
    default:
      return null;
  }
}
