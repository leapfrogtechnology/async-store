# Async Store

[![npm](https://img.shields.io/npm/v/@leapfrogtechnology/async-store.svg?style=flat-square)](https://www.npmjs.com/package/@leapfrogtechnology/async-store)
[![Travis](https://img.shields.io/travis/com/leapfrogtechnology/async-store.svg?style=flat-square)](https://travis-ci.com/leapfrogtechnology/async-store)
[![LICENSE](https://img.shields.io/github/license/leapfrogtechnology/async-store.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/leapfrogtechnology/async-store)

Global store utility for an async operation lifecycle and chain of callbacks. It is utility tool similar to [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage) which allows us to set and get values that are scoped to the lifetime of these chains of callbacks. It uses [domain](https://nodejs.org/api/domain.html) native Node.js module.

**Simple example,**

```js
var asyncStore = require('async-store');

var callback = function {
  asyncStore({ foo: 'Hello', bar: 'World' });

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
      // Store value is also available at the end of the promise chain.
      console.log('Value of foo: ', globalStore.get('foo'));
    });
};

asyncStore.initialize()(callback);
```

**Simple express.js example or [here](https://github.com/kabirbaidhya/async-store-sample)**

```js
var uuid = require('uuid');
var express = require('express');
var asyncStore = require('async-store');

const app = express();
const port = 3000;

// Initialize async store
app.use(asyncStore.initializeMiddleware);

// Set request Id in store
app.use((req, res, next) => {
  asyncStore.set({ reqId: uuid.v4() });
});

// Get request Id from store
app.get('/', (req, res) => {
  const reqId = asyncStore.get('reqId');
  console.log(`[${reqId}]`);

  res.json({ message: 'Hello World' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### initializeMiddleware()

Middleware to initialize the async store and make it accessible from all the subsequent middlewares or async operations triggered afterwards.

```js
var express = require('express');
var asyncStore = require('async-store');

// Initialize async store
app.use(asyncStore.initializeMiddleware);
```

### set()

It sets properties in the store.

```js
asyncStore.set({ foo: 'Hello', bar: 'World' });
```

### get()

It gets a value by a key from the store.

```js
asyncStore.get('foo');
```

### find()

It gets a value by a key from the store. If anything fails, it returns null without emitting error event.

```js
asyncStore.find('foo');
```

## Change Log

Check the [CHANGELOG](CHANGELOG.md) for change log and release history.

## License

Licensed under [The MIT License](LICENSE).
