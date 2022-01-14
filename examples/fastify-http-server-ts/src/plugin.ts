import { doSomethingAsync } from './service';
import * as store from '@leapfrogtechnology/async-store';
import { FastifyRequest, FastifyPluginCallback, FastifyPluginAsync } from 'fastify';

type RequestQuery = FastifyRequest<{
  Querystring: { a: string; b: string };
}>;

/**
 * Plugin to set query params `a` and `b` on async-store.
 *
 * @param {FastifyPluginCallback} callback
 */
export const storeParams: FastifyPluginCallback = (fastify, _, next) => {
  fastify.addHook('onRequest', (req: RequestQuery, reply, done) => {
    const { a, b } = req.query;
    store.set({ a, b });

    fastify.log.info(`Persisted a: ${a}`);
    fastify.log.info(`Persisted b: ${b}`);

    done();
  });

  next();
};

/**
 * Plugin to add the parameters `a` and `b` and set `sum` on the async store.
 *
 * @param {FastifyInstance} fastify
 * @param {FastifyPluginOptions} opts
 */
export const calculateSum: FastifyPluginAsync = async (fastify, _) => {
  fastify.addHook('preHandler', async () => {
    const data = await doSomethingAsync();
    fastify.log.info(`Store contents: ${JSON.stringify(data)}`);
    const a = +store.get('a');
    const b = +store.get('b');
    const sum = a + b;

    store.set({ sum });

    fastify.log.info(`Persisted sum: ${sum}`);
  });
};
