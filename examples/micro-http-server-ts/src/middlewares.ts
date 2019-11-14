import * as qs from "qs";
import { ServerResponse, IncomingMessage } from "http";

import * as store from "@leapfrogtechnology/async-store";

import * as logger from "./logger";
import { doSomethingAsync } from "./service";

/**
 * Middleware to set query params `a` and `b` on async-store.
 *
 * @param {any} query
 */
export function storeParams(query: any) {
  const { a, b } = qs.parse(query);

  store.set({ a, b });

  logger.debug(`Persisted a: ${a}`);
  logger.debug(`Persisted b: ${b}`);
}

/**
 * Middleware to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function calculateSum(req: IncomingMessage, res: ServerResponse) {
  doSomethingAsync();

  const a = +store.get("a");
  const b = +store.get("b");
  const sum = a + b;

  store.set({ sum });
  logger.debug(`Calculated sum: ${sum}`);
  logger.debug(`Persisted sum: ${sum}`);
}
