# Async Store

[![npm](https://img.shields.io/npm/v/@leapfrogtechnology/async-store.svg?style=flat-square)](https://www.npmjs.com/package/@leapfrogtechnology/async-store)
[![Codecov](https://img.shields.io/codecov/c/github/leapfrogtechnology/async-store?style=flat-square)](https://codecov.io/gh/leapfrogtechnology/async-store)
[![LICENSE](https://img.shields.io/github/license/leapfrogtechnology/async-store.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store#contributing)

Global store utility for an async operation lifecycle and chain of callbacks. It is a utility tool similar to [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage) which allows us to set and get values that are scoped to the lifetime of these chains of callbacks.

**Note: async-store uses [domain](https://nodejs.org/api/domain.html) Node.js module under the hood.**

It is recommended that you read about domain before using this package.

## Installation

```sh
npm install @leapfrogtechnology/async-store
```

```sh
yarn add @leapfrogtechnology/async-store
```

## Version Compatibility

| Node Version      | Async Store Version |
| ----------------- | ------------------- |
| 14.17.0 and above | >= 2.0.0            |
| 14.17.0 and below | >= 1.0.0 < 2.0.0    |

## Usage

### JavaScript Example

```js
const store = require('@leapfrogtechnology/async-store');

store.initialize()(callback);

function callback() {
  store.set({ foo: 'Hello', bar: 'World' });

  Promise.resolve()
    .then(() => {
      console.log('Value of foo: ', store.get('foo'));
    })
    .then(() => {
      console.log('Value of bar: ', store.get('bar'));
    })
    .then(() => {
      console.log('Value of foo: ', store.get('foo'));
    })
    .then(() => {
      console.log('Value of bar: ', store.get('bar'));
    });
}
```

#### Output

On initialization the following output in the console is seen:

```
Value of foo:  Hello
Value of bar:  World
Value of foo:  Hello
Value of bar:  World
```

### TypeScript Example

```js
import * as store from '@leapfrogtechnology/async-store';

store.initialize()(callback);

function callback() {
  store.set({ foo: 'Hello', bar: 'World' });

  Promise.resolve()
    .then(() => {
      console.log('Value of foo: ', store.get('foo'));
    })
    .then(() => {
      console.log('Value of bar: ', store.get('bar'));
    })
    .then(() => {
      console.log('Value of foo: ', store.get('foo'));
    })
    .then(() => {
      console.log('Value of bar: ', store.get('bar'));
    });
}
```

#### Output

On initialization the following output in the console is seen:

```
Value of foo:  Hello
Value of bar:  World
Value of foo:  Hello
Value of bar:  World
```

### Express Example

```js
const { randomUUID } = require('crypto');
const express = require('express');
const store = require('@leapfrogtechnology/async-store');

const app = express();
const port = 3000;

// Initialize async store
app.use(store.initializeMiddleware());

// Set request Id in store
app.use((req, res, next) => {
  store.set({ reqId: randomUUID() });
  next();
});

// Get request Id from store
app.get('/', (req, res) => {
  const reqId = store.get('reqId');
  console.log(`Request Id: ${reqId}`);

  res.json({ message: 'Hello World', reqId });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

#### Output

On request to `http://localhost:3000`, the following output in the console is seen:

```
Example app listening on port 3000!
Request Id: 03d8bd27-9097-427a-9460-7d8d9576f156
```

### Fastify Example

```js
const { randomUUID } = require('crypto');
const fastifyPlugin = require('fastify-plugin');
const store = require('@leapfrogtechnology/async-store');

const fastifyServer = require('fastify')({ logger: true });

const port = 3000;

fastifyServer.register(fastifyPlugin(store.initializeFastifyPlugin()));

fastifyServer.register((fastifyInstance, opts, done) => {
  fastifyInstance.addHook('preHandler', (req, reply, done) => {
    store.set({ reqId: randomUUID() });
    done();
  });

  fastifyInstance.get('/', (req, reply) => {
    const reqId = store.get('reqId');
    console.log(`Request Id: ${reqId}`);

    reply.send({ message: 'Hello World', reqId });
  });

  done();
});

const start = async () => {
  try {
    await fastifyServer.listen(port);
    fastifyServer.log.info(`Server is listening at ${port}`);
  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};

start();
```

#### Output

On request to `http://localhost:3000`, the following output in the console is seen:

```
{"level":30,"time":1641890535421,"pid":12489,"hostname":"macbookpro","msg":"Server listening at http://[::1]:3000"}
{"level":30,"time":1641890535421,"pid":12489,"hostname":"macbookpro","msg":"Server is listening at 3000"}
{"level":30,"time":1641890539755,"pid":12489,"hostname":"macbookpro","reqId":"req-1","req":{"method":"GET","url":"/","hostname":"localhost:3000","remoteAddress":"::1","remotePort":51539},"msg":"incoming request"}
Request Id: aa6e86e9-c9d4-414a-8670-9aeaf2a8d932
{"level":30,"time":1641890539759,"pid":12489,"hostname":"macbookpro","reqId":"req-1","res":{"statusCode":200},"responseTime":3.7935830000787973,"msg":"request completed"}
```

## API Docs

### initialize()

Initialize the async store based on the adapter provided.

- `@param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]` - Async store adapter to use.
- `@returns {(params: AsyncStoreParams) => void}` - Returns a function that takes a callback which will be triggered once the store has been initialized.

```js
const store = require('@leapfrogtechnology/async-store');

store.initialize()(callback);

function callback() {
  // Do something with the store.
}
```

### initializeMiddleware()

Middleware to initialize the async store and make it accessible from all the subsequent middlewares or async operations triggered afterwards.

- `@param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]` - Async store adapter to use.
- `@returns {(req, res, next) => void}` - Returns the express middleware function.

```js
const express = require('express');
const store = require('@leapfrogtechnology/async-store');

// Initialize async store
app.use(store.initializeMiddleware());
```

### initializeFastifyPlugin()

Plugin to initialize the async store and make it accessible from all the subsequent plugin or async operations triggered afterwards from fastify server.

- `@param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]` - Async store adapter to use.
- `@returns {(fastifyInstance, opts, next) => void}` - Returns the fastify plugin callback.

```js
const fastify = require('fastify');
const fastifyPlugin = require('fastify-plugin');
const store = require('@leapfrogtechnology/async-store');

// Initialize async store
fastify.register(fastifyPlugin(store.initializeFastifyPlugin()));
```

### isInitialized()

Check if the store has been initialized or not.

- `@returns {boolean}` - Returns either true or false.

```js
if (store.isInitialized()) {
  // Do something.
}
```

### set()

Persists properties in the store.

- `@params {any} properties` - Persist properties to set in store.
- `@returns {void}`

```js
store.set({ foo: 'Hello', bar: 'World' });
```

### get()

Gets a value by a key from the store.

- `@params {string} key` - Key to get from the store.
- `@returns {any}` - Returns the value persisted in the store by `key` which could be `null` if key not found. Any error caught during the retrieval will be thrown and cascaded.

```js
const foo = store.get('foo');
```

### getAll()

Gets all values from the store.

- `@returns {any}` - Returns all values persisted in the store. Any error caught during the retrieval will be thrown and cascaded.

```js
store.set({ foo: 'Hello', bar: 'World', baz: 'Baz' });

// Get all the values from the store.
const values = store.getAll(); // { foo: 'Hello', bar: 'World', baz: 'Baz' }

// De-structure and get only few of them.
const { foo, baz } = store.getAll();
```

### getByKeys()

Gets multiple values from the store for each of the keys provided.

- `@params {string[] keys}` - Keys to get from the store.
- `@returns {T[]}` - Returns an array of values. Order of the values is same as the order of the keys in the array.

```js
const [a, b, sum] = store.getByKeys(['a', 'b', 'sum']);
```

### find()

Gets a value by a key from the store. If anything fails, it returns `null` without emitting error event.

- `@params {string} key` - Key to get from the store.
- `@returns {any}` - Returns the value persisted in the store by `key` which could be `null` if key not found. Any error caught during the retrieval will be supressed and `null` value is returned.

```js
const foo = store.find('foo');
```

### getId()

Gets the unique store id created for the current context/scope.
Example: If used in express, it returns unique store id per request.

- `@returns {string | undefined}` - Returns the unique store id.

```js
const requestIdentifier = store.getId();
```

### getShortId()

Gets the short unique store id created for the current context/scope.

Note: This is same as `getId();` the difference being it only returns the first 8 characters.

- `@returns {string | undefined}` - Returns the short unique store id.

```js
const requestIdentifier = store.getShortId();
```

### reset()

Reset the store or a specific key of the global store.

- `@returns {void}`

```js
store.reset(); // Reset the whole store

store.reset('foo') // It will delete the key foo from store and get will result undefined
```

## Example Projects

1. [Node Web Server (TypeScript)](examples/node-http-server-ts)
2. [Express Web Server (TypeScript)](examples/express-http-server-ts)
3. [Koa Web Server (TypeScript)](examples/koa-http-server-ts)
4. [Fastify Web Server (TypeScript)](examples/fastify-http-server-ts)

## Changelog

Check the [CHANGELOG](CHANGELOG.md) for release history.

## Contributing

Any types of contributions are welcome. Feel free to send pull requests or create issues.

## License

Licensed under [The MIT License](LICENSE).
