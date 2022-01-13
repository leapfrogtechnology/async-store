import { doSomethingAsync } from './service';
import * as store from '@leapfrogtechnology/async-store';
import {
  FastifyReply,
  FastifyRequest,
  FastifyPluginCallback,
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync
} from 'fastify';

type RequestQuery = FastifyRequest<{
  Querystring: { a: string; b: string };
}>;

/**
 * Plugin to set query params `a` and `b` on async-store.
 *
 * @param {FastifyInstance} fastify
 * @param {FastifyPluginOptions} opts
 * @param {any} next
 *
 */
export const storeParamsPlugin: FastifyPluginCallback = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  next: any
) => {
  fastify.addHook('onRequest', (req: RequestQuery, reply: FastifyReply, done) => {
    const { a, b } = req.query;
    store.set({ a, b });

    fastify.log.debug(`Persisted a: ${a}`);
    fastify.log.debug(`Persisted b: ${b}`);

    done();
  });

  next();
};

/**
 * Plugin to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @param {FastifyInstance} fastify
 * @param {FastifyPluginOptions} opts
 *
 */
export const calculateSum: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.addHook('preHandler', async (req, reply) => {
    const data = await doSomethingAsync();
    fastify.log.info(`Store contents: ${JSON.stringify(data)}`);
    const a = +store.get('a');
    const b = +store.get('b');
    const sum = a + b;

    store.set({ sum });

    fastify.log.debug(`Calculated sum: ${sum}`);
    fastify.log.debug(`Persisted sum: ${sum}`);
  });
};
