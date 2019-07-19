# Async Store

[![npm](https://img.shields.io/npm/v/@leapfrogtechnology/async-store.svg?style=flat-square)](https://www.npmjs.com/package/@leapfrogtechnology/async-store)
[![Travis](https://img.shields.io/travis/com/leapfrogtechnology/async-store.svg?style=flat-square)](https://travis-ci.com/leapfrogtechnology/async-store)
[![LICENSE](https://img.shields.io/github/license/leapfrogtechnology/async-store.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store)

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

### Simple JavaScript Example

```js
const store = require('@leapfrogtechnology/async-store');

function callback() {
  store({ foo: 'Hello', bar: 'World' });

  Promise.resolve()
    .then(() => {
      console.log('Value of foo: ', globalStore.get('foo'));
    })
    .then(() => {
      console.log('Value of foo: ', globalStore.get('foo'));
    })
    .then(() => {
      console.log('Value of foo: ', globalStore.get('foo'));
    })
    .then(() => {
      // Store value is available at the end of the promise chain.
      console.log('Value of foo: ', globalStore.get('foo'));
    });
}

store.initialize()(callback);
```

### Simple TypeScript Example

```js
import * as store from '@leapfrogtechnology/async-store';

function callback() {
  store({ foo: 'Hello', bar: 'World' });

  Promise.resolve()
    .then(() => {
      console.log('Value of foo: ', globalStore.get('foo'));
    })
    .then(() => {
      console.log('Value of foo: ', globalStore.get('foo'));
    })
    .then(() => {
      // Store value is available at the end of the promise chain.
      console.log('Value of foo: ', globalStore.get('foo'));
    });
}

store.initialize()(callback);
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
  console.log(`[${reqId}]`);

  res.json({ message: 'Hello World' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

## Sample Projects
1. [Simple Express Sample (TypeScript)](examples/express-ts)

## API Docs

### initializeMiddleware()

Middleware to initialize the async store and make it accessible from all the subsequent middlewares or async operations triggered afterwards.

- `@param {AsyncStoreAdapter} [adapter=AsyncStoreAdapter.DOMAIN]`: Store adaptor (Default: domain).
- `@returns {(req, res, next) => void}`

```js
const express = require('express');
const store = require('@leapfrogtechnology/async-store');

// Initialize async store
app.use(store.initializeMiddleware());
```

### set()

It sets properties in the store.

- `@params {any} properties`: Properties to set in store.
- `@returns {void}`

**Example**

```js
store.set({ foo: 'Hello', bar: 'World' });
```

### get()

It gets a value by a key from the store.

- `@params {string} key` - Key specifies property of store.
- `@returns {any}`

```js
store.get('foo');
```

### find()

It gets a value by a key from the store. If anything fails, it returns null without emitting error event.

- `@params {string} key` - Key specifies property of store.
- `@returns {any}`

```js
store.find('foo');
```

## Changelog

Check the [CHANGELOG](CHANGELOG.md) for release history.

## License

Licensed under [The MIT License](LICENSE).
