import fastifyPlugin from 'fastify-plugin';
import * as store from '@leapfrogtechnology/async-store';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { storeParamsPlugin, calculateSum } from './plugin';

const fastifyServer: FastifyInstance = Fastify({ logger: true });

fastifyServer.register(fastifyPlugin(store.initializeFastifyPlugin()));
fastifyServer.register(fastifyPlugin(storeParamsPlugin));

fastifyServer.register((fastifyInstance, opts, done) => {
  fastifyInstance.register(fastifyPlugin(calculateSum));
  fastifyInstance.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    const a = store.get('a');
    const b = store.get('b');
    const sum = store.get('sum');

    reply.send(`Sum of ${a}, ${b}: ${sum}\n`);

    reply.log.info('Response Sent');
  });

  done();
});

async function start() {
  try {
    await fastifyServer.listen(3000);
    fastifyServer.log.info(`Server is listening at 3000`);
  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
}

start();
