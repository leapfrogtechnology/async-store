# Async Store

[![npm](https://img.shields.io/npm/v/@leapfrogtechnology/async-store.svg?style=flat-square)](https://www.npmjs.com/package/@leapfrogtechnology/async-store)
[![Travis](https://img.shields.io/travis/com/leapfrogtechnology/async-store.svg?style=flat-square)](https://travis-ci.com/leapfrogtechnology/async-store)
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

### Express Example

```js
const uuid = require('uuid');
const express = require('express');
const store = require('@leapfrogtechnology/async-store');

const app = express();
const port = 3000;

// Initialize async store
app.use(store.initializeMiddleware());

// Set request Id in store
app.use((req, res, next) => {
  store.set({ reqId: uuid.v4() });
});

// Get request Id from store
app.get('/', (req, res) => {
  const reqId = store.get('reqId');
  console.log(`Request Id: ${reqId}`);

  res.json({ message: 'Hello World' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

## Sample Projects

1. [Basic Node Web Server (TypeScript)](examples/node-http-server-ts)
2. [Simple Express Web Server (TypeScript)](examples/express-http-server-ts)

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

## Changelog

Check the [CHANGELOG](CHANGELOG.md) for release history.

## Contributing

Any types of contributions are welcome. Feel free to send pull requests or create issues.

## License

Licensed under [The MIT License](LICENSE).
