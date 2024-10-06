import 'mocha';
import { expect } from 'chai';
import * as domain from 'domain';
import { EventEmitter } from 'events';
import { createRequest, createResponse } from 'node-mocks-http';

import * as globalStore from '../src';
import Middleware from '../src/Middleware';
import { STORE_KEY } from '../src/StoreDomain';
import AsyncStoreAdapter from '../src/AsyncStoreAdapter';

describe('store: [adapter=DOMAIN]', () => {
  const adapter = AsyncStoreAdapter.DOMAIN;
  const initMiddleware: Middleware = globalStore.initializeMiddleware(adapter);
  const initDefaultMiddleware: Middleware = globalStore.initializeMiddleware();

  beforeEach(() => {
    Object.assign(process, { domain: undefined });
  });

  describe('initializeMiddleware()', () => {
    it('should return a middleware function.', () => {
      expect(initMiddleware).to.be.a('function');
      expect(initDefaultMiddleware).to.be.a('function');
      expect(initMiddleware.length).to.equal(3);
      expect(initDefaultMiddleware.length).to.equal(3);
    });
  });

  describe('initialize()', () => {
    it('should initialize the store.', (done) => {
      const callback = () => {
        expect(!!(process.domain as any)[STORE_KEY]).to.equal(true);
        expect(globalStore.isInitialized()).to.equal(true);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should also bind params if params are passed through arguments.', (done) => {
      const req = new EventEmitter();
      const res = new EventEmitter();
      const emitters = [req, res];
      const errorCallback = (err: any) => err;

      const callback = () => {
        // Postmortem domain to check bound arguments.
        expect((process.domain as any)._events.error).to.equal(errorCallback);
        expect((process.domain as any).members[0]).to.equal(req);
        expect((process.domain as any).members[1]).to.equal(res);

        done();
      };

      globalStore.initialize(adapter)(callback, {
        req,
        res,
        emitters,
        error: errorCallback
      });
    });
  });

  describe('isInitialized()', () => {
    const [req, res] = [createRequest(), createResponse()];

    const checkStore = (done: Mocha.Done) => {
      const callback = () => {
        const isInitialized = globalStore.isInitialized();
        expect(isInitialized).to.equal(true);
        initMiddleware(req, res, () => {
          expect(isInitialized).to.equal(true);
        });

        done();
      };

      initMiddleware(req, res, callback);
    };

    it('should return false when not initialized.', () => {
      expect(globalStore.isInitialized()).to.equal(false);
    });

    it('should return true when initialized through the middleware.', (done) => {
      checkStore(done);
    });

    it('should return false when initialized but invoked out of the active domain.', (done) => {
      // Initialized
      globalStore.initialize(adapter)(() => null);

      setTimeout(() => {
        // Invoke it out of domain.
        expect(globalStore.isInitialized()).to.equal(false);
        done();
      }, 500);
    });

    it('should return true when initialized and invoked within the active domain.', (done) => {
      const callback = () => {
        expect(globalStore.isInitialized()).to.equal(true);
        done();
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('get()', () => {
    it('should throw an error if store not initialized.', () => {
      expect(globalStore.get.bind(globalStore, 'foo')).to.throw('No active domain found in store.');
    });

    it('should return null if invoked under active domain w/o proper store initialization.', (done) => {
      const d = domain.create();

      d.run(() => {
        // Ensure data in the existing domain is available at this point.
        expect(globalStore.get('foo')).to.equal(null);

        done();
      });
    });

    it('should return `undefined` if the value was not set.', (done) => {
      const callback = () => {
        expect(globalStore.get('foo')).to.equal(undefined);
        done();
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('getAll()', () => {
    it('should return all values from the store.', (done) => {
      const a = 1;
      const b = 2;
      const sum = a + b;

      const callback = () => {
        globalStore.set({ a, b });
        globalStore.set({ sum });

        doSomething().then(done);
      };

      const doSomething = () =>
        Promise.resolve()
          .then(() => {
            expect(globalStore.get('a')).to.equal(a);
            expect(globalStore.get('b')).to.equal(b);
            expect(globalStore.get('sum')).to.equal(sum);
          })
          .then(() => {
            expect(globalStore.getAll()).deep.equal({ a, b, sum });
          });

      globalStore.initialize(adapter)(callback);
    });

    it('should return null if invoked under active domain w/o proper store initialization.', (done) => {
      const d = domain.create();

      d.run(() => {
        // Ensure data in the existing domain is available at this point.
        expect(globalStore.getAll()).to.equal(null);

        done();
      });
    });
  });

  describe('getByKeys()', () => {
    it('should throw an error if store not initialized.', () => {
      expect(globalStore.get.bind(globalStore, 'foo')).to.throw('No active domain found in store.');
    });

    it('should return `undefined` as the value for requested keys that were not set.', (done) => {
      const callback = () => {
        expect(globalStore.getByKeys(['foo', 'bar'])).to.deep.equal([undefined, undefined]);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should return an array of matching values in the same order as the list of requested keys.', (done) => {
      const callback = () => {
        globalStore.set({ a: 1, b: 2, sum: 3, somethingNull: null });

        expect(globalStore.getByKeys(['a', 'b', 'somethingNull', 'sum'])).to.deep.equal([1, 2, null, 3]);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should return an identical array of same length even if there are unknown (not set) keys.', (done) => {
      const callback = () => {
        globalStore.set({ a: 1, b: 2, z: 5 });

        expect(globalStore.getByKeys(['a', 'b', 'c', 'd', 'z'])).to.deep.equal([1, 2, undefined, undefined, 5]);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should throw an error when empty list of keys is passed.', () => {
      const callback = () => {
        expect(globalStore.getByKeys.bind(globalStore, [])).to.throw(
          'No keys provided for getting the values from store.'
        );
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('getId()', () => {
    it('should return unique value if store is initialized.', (done) => {
      const callback = () => {
        expect(globalStore.getId()).to.be.an('string');
        expect(globalStore.getId()).to.not.equal(null);
        expect(globalStore.getId()).to.not.equal(undefined);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should return `undefined` if store is not initialized.', (done) => {
      expect(globalStore.getId).to.not.throw();
      expect(globalStore.getId()).to.equal(undefined);

      done();
    });
  });

  describe('getShortId()', () => {
    it('should return short (8 chars) unique value if store is initialized.', (done) => {
      const callback = () => {
        expect(globalStore.getShortId()).to.be.an('string');
        expect(globalStore.getShortId()).to.not.equal(null);
        expect(globalStore.getShortId()).to.not.equal(undefined);
        expect(globalStore.getShortId()).to.be.lengthOf(8);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should return `undefined` if store is not initialized.', (done) => {
      expect(globalStore.getShortId).to.not.throw();
      expect(globalStore.getShortId()).to.equal(undefined);

      done();
    });
  });

  describe('find()', () => {
    it('should successfully return value in synchronous callback.', (done) => {
      const callback = () => {
        first();
        second();

        done();
      };

      const first = () => {
        globalStore.set({
          foo: 'foo',
          bar: {
            key1: {
              foo: 'Hello',
              bar: 'World'
            },
            key2: 'Foo Bar'
          }
        });
      };
      const second = () => {
        expect(globalStore.find('foo')).to.equal('foo');
        expect(globalStore.find('bar')).deep.equal({
          key1: {
            foo: 'Hello',
            bar: 'World'
          },
          key2: 'Foo Bar'
        });

        globalStore.set({ foo: 'Foo' });

        expect(globalStore.find('foo')).to.equal('Foo');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should successfully return value in asynchronous callback.', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'bar' });

        doSomething().then(done);
      };

      const doSomething = () =>
        Promise.resolve()
          .then(() => {
            expect(globalStore.find('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.find('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.find('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.find('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.find('foo')).to.equal('bar');
          });

      globalStore.initialize(adapter)(callback);
    });

    it('should return null even if store not initialized.', () => {
      expect(globalStore.find('foo')).to.equal(null);
    });

    it('should return `undefined` if the value was not set.', (done) => {
      const callback = () => {
        expect(globalStore.find('foo')).to.equal(undefined);
        done();
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('set()', () => {
    it('should throw an error if store not initialized.', () => {
      expect(globalStore.set.bind(globalStore, {})).to.throw('Async store not initialized.');
    });

    it('should throw an error if invalid arguments are provided.', (done) => {
      const callback = () => {
        expect(globalStore.set.bind(globalStore, 5)).to.throw('Invalid arguments provided for asyncStore.set()');
        expect(globalStore.set.bind(globalStore, 'five')).to.throw('Invalid arguments provided for asyncStore.set()');
        expect(globalStore.set.bind(globalStore, null)).to.throw('Invalid arguments provided for asyncStore.set()');
        expect(globalStore.set.bind(globalStore, undefined)).to.throw(
          'Invalid arguments provided for asyncStore.set()'
        );

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should set properties in the store.', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'Hello', bar: 'World' });
        second();
        done();
      };

      const second = () => {
        expect((process.domain as any)[STORE_KEY]['foo']).to.equal('Hello');
        expect((process.domain as any)[STORE_KEY]['bar']).to.equal('World');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should merge and override existing properties if set multiple times.', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'Hello', bar: 'World' });
        second();
        third();
        done();
      };

      const second = () => {
        expect((process.domain as any)[STORE_KEY]['foo']).to.equal('Hello');
        expect((process.domain as any)[STORE_KEY]['bar']).to.equal('World');

        globalStore.set({ foo: 'Foo', bar: 'Bar', baz: 'Baz' });
      };

      const third = () => {
        expect((process.domain as any)[STORE_KEY]['foo']).to.equal('Foo');
        expect((process.domain as any)[STORE_KEY]['bar']).to.equal('Bar');
        expect((process.domain as any)[STORE_KEY]['baz']).to.equal('Baz');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should merge and override existing properties recursively.', (done) => {
      const callback = () => {
        first();
        second();
        done();
      };

      const first = () => {
        globalStore.set({
          foo: 'Foo',
          bar: {
            key1: {
              foo: 'Hello',
              bar: 'World'
            },
            key2: 'Foo Bar'
          }
        });

        expect((process.domain as any)[STORE_KEY]['foo']).to.equal('Foo');
        expect((process.domain as any)[STORE_KEY]['bar']['key1']['foo']).to.equal('Hello');
        expect((process.domain as any)[STORE_KEY]['bar']['key1']['bar']).to.equal('World');
      };

      const second = () => {
        globalStore.set({
          foo: 'Foo',
          bar: {
            key1: 'Foo Bar',
            key2: 'Hello World',
            key3: 'Foo World'
          },
          baz: 'Baz'
        });

        expect((process.domain as any)[STORE_KEY]['foo']).to.equal('Foo');
        expect((process.domain as any)[STORE_KEY]['bar']['key1']).to.equal('Foo Bar');
        expect((process.domain as any)[STORE_KEY]['bar']['key2']).to.equal('Hello World');
        expect((process.domain as any)[STORE_KEY]['bar']['key3']).to.equal('Foo World');
        expect((process.domain as any)[STORE_KEY]['baz']).to.equal('Baz');
      };

      globalStore.initialize(adapter)(callback);
    });

    // @see https://github.com/leapfrogtechnology/async-store/issues/105
    it('should set properties without polluting the prototype.', (done) => {
      const callback = () => {
        globalStore.set(JSON.parse('{"__proto__":{"vuln":true}}'));
        first();
        done();
      };

      const first = () => {
        expect((process.domain as any)[STORE_KEY]['vuln']).to.not.equal(true);
        expect((process.domain as any)[STORE_KEY]['__proto__']).to.equal(undefined);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should set properties without polluting the prototype of any property.', (done) => {
      const callback = () => {
        globalStore.set(JSON.parse('{"foo":{"__proto__":{"vuln":true}}}'));
        first();
        done();
      };

      const first = () => {
        expect((process.domain as any)[STORE_KEY]['foo']['vuln']).to.not.equal(true);
        expect((process.domain as any)[STORE_KEY]['foo']['__proto__']).to.be.not.undefined;
        expect((process.domain as any)[STORE_KEY]['__proto__']).to.equal(undefined);
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('Reset():', () => {
    it('should reset the store by removing all values', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'foo', bar: 'bar' });

        globalStore.reset();

        expect(globalStore.isInitialized()).to.equal(false);

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should reset the store by removing a specific value by key', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'foo', bar: 'bar' });

        globalStore.reset('foo');

        expect(globalStore.get('foo')).to.equal(undefined);
        expect(globalStore.get('bar')).to.equal('bar');

        done();
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('Test Cases:', () => {
    it('should work with a chain of sequentially invoked callbacks (synchronous).', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'foo', bar: 'bar' });

        first();
        second();
        third();
        done();
      };

      const first = () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const second = () => {
        expect(globalStore.get('foo')).to.equal('foo');

        globalStore.set({ foo: 'Foo' });

        expect(globalStore.get('foo')).to.equal('Foo');
      };

      const third = () => {
        expect(globalStore.get('foo')).to.equal('Foo');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with chain of promises resolved.', (done) => {
      const doSomething = () =>
        Promise.resolve()
          .then(() => {
            expect(globalStore.get('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.get('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.get('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.get('foo')).to.equal('bar');
          })
          .then(() => {
            expect(globalStore.get('foo')).to.equal('bar');
          });

      const callback = () => {
        globalStore.set({ foo: 'bar', bar: 'bonk' });

        doSomething().then(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with chain of promises (resolved or rejected).', (done) => {
      const doSomething = () =>
        Promise.reject()
          .then(() => {
            expect(globalStore.get('bar')).to.equal('Bar');
          })
          .catch(() => {
            expect(globalStore.get('bar')).to.equal('Bar');
          });

      const callback = () => {
        globalStore.set({ bar: 'Bar' });

        doSomething().then(done).catch(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with Promise.all().', (done) => {
      const p1 = () =>
        Promise.resolve().then(() => {
          expect(globalStore.get('baz')).to.equal('Baz');
        });

      const p2 = () =>
        Promise.resolve().then(() => {
          expect(globalStore.get('baz')).to.equal('Baz');
        });

      const doSomething = () =>
        Promise.all([p1, p2])
          .then(() => {
            expect(globalStore.get('baz')).to.equal('Baz');
          })
          .catch(() => {
            expect(globalStore.get('baz')).to.equal('Baz');
          });

      const callback = () => {
        globalStore.set({ baz: 'Baz' });

        doSomething().then(done).catch(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with setTimeout() based async callback chains.', (done) => {
      const callback = () => {
        setTimeout(() => {
          globalStore.set({ foo: 'foo' });

          setTimeout(() => {
            first();

            setTimeout(() => {
              second();

              setTimeout(() => {
                third();

                setTimeout(() => {
                  fourth();

                  setTimeout(done, 1);
                }, 1);
              }, 1);
            }, 1);
          }, 1);
        }, 1);
      };

      const first = () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const second = () => {
        expect(globalStore.get('foo')).to.equal('foo');

        globalStore.set({ foo: 'Foo' });

        expect(globalStore.get('foo')).to.equal('Foo');
      };

      const third = () => {
        expect(globalStore.get('foo')).to.equal('Foo');
      };

      const fourth = () => {
        expect(globalStore.get('foo')).to.equal('Foo');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with setImmediate() based async callback chains.', (done) => {
      const callback = () => {
        setImmediate(() => {
          globalStore.set({ foo: 'foo' });

          setImmediate(() => {
            first();

            setImmediate(() => {
              second();

              setImmediate(() => {
                third();

                setImmediate(done);
              });
            });
          });
        });
      };

      const first = () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const second = () => {
        expect(globalStore.get('foo')).to.equal('foo');

        globalStore.set({ foo: 'Foo' });

        expect(globalStore.get('foo')).to.equal('Foo');
      };

      const third = () => {
        expect(globalStore.get('foo')).to.equal('Foo');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with process.nextTick() based async callback chains.', (done) => {
      const callback = () => {
        process.nextTick(() => {
          globalStore.set({ foo: 'foo' });

          process.nextTick(() => {
            first();

            process.nextTick(() => {
              second();

              process.nextTick(() => {
                third();

                process.nextTick(done);
              });
            });
          });
        });
      };

      const first = () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const second = () => {
        expect(globalStore.get('foo')).to.equal('foo');

        globalStore.set({ foo: 'Foo' });

        expect(globalStore.get('foo')).to.equal('Foo');
      };

      const third = () => {
        expect(globalStore.get('foo')).to.equal('Foo');
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with async and await based callbacks.', (done) => {
      const p1 = () => {
        return new Promise((resolve) => {
          expect(globalStore.get('foo')).to.equal('foo');

          setTimeout(() => {
            expect(globalStore.get('foo')).to.equal('foo');
            resolve(null);
          }, 1);
        });
      };

      const p2 = async () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const p3 = async () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const callback = async () => {
        globalStore.set({ foo: 'foo' });

        await Promise.all([p1(), p2(), p3()]);

        expect(globalStore.get('foo')).to.equal('foo');

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with stores in different callback contexts loaded separately (dynamic import()).', (done) => {
      const first = async () => {
        const store = await import('../src');

        store.set({ foo: 'foo' });
      };

      const second = async () => {
        const store = await import('../src');

        store.set({ bar: 'bar' });

        expect(store.get('foo')).to.equal('foo');
        expect(store.get('bar')).to.equal('bar');
      };

      const third = async () => {
        const store = await import('../src');

        store.set({ tar: 'tar' });

        expect(store.get('foo')).to.equal('foo');
        expect(store.get('bar')).to.equal('bar');
        expect(store.get('tar')).to.equal('tar');
      };

      const fourth = async () => {
        const store = await import('../src');

        expect(store.get('foo')).to.equal('foo');
        expect(store.get('bar')).to.equal('bar');
        expect(store.get('tar')).to.equal('tar');
      };

      const callback = async () => {
        const store = await import('../src');

        await first();
        await second();
        await third();
        await fourth();

        expect(store.get('foo')).to.equal('foo');
        expect(store.get('bar')).to.equal('bar');
        expect(store.get('tar')).to.equal('tar');

        done();
      };

      globalStore.initialize(adapter)(callback);
    });

    it("should work even if the store is initialized under active domain w/o affecting the existing domain's attributes.", (done) => {
      // Existing domain.
      const d = domain.create() as any;

      d.existingData = 'Hello world';

      const callback = () => {
        Promise.resolve().then(first).then(second).then(third).then(done).catch(done);
      };

      const first = () => {
        globalStore.set({ foo: 'foo' });
      };

      const second = () => {
        // Store should still have the data set.
        expect(globalStore.get('foo')).to.equal('foo');

        // And the existing data in the domain before our store
        // was initialized should still be there.
        expect((process.domain as any).existingData).to.equal('Hello world');
      };

      const third = () => {
        // Ensure the same existing domain is used instead of creating a new one.
        expect(process.domain).to.equal(d);
      };

      d.run(() => {
        // Ensure data in the existing domain is available at this point.
        expect((process.domain as any).existingData).to.equal('Hello world');

        globalStore.initialize(adapter)(callback);
      });
    });

    it('should return the response from callback function.', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'foo' });

        return functionAccessingStore();
      };

      const functionAccessingStore = () => {
        return globalStore.get('foo');
      };

      const response = globalStore.initialize(adapter)(callback);
      expect(response).to.equal('foo');

      done();
    });

    it('should return the response from async callback function.', async () => {
      const callback = async () => {
        globalStore.set({ foo: 'foo' });

        functionAccessingStore();
        const response = await asyncTask();

        return response;
      };

      const functionAccessingStore = () => {
        expect(globalStore.get('foo')).to.equal('foo');
      };

      const asyncTask = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(globalStore.get('foo'));
          }, 1);
        });
      };

      const response = await globalStore.initialize(adapter)(callback);
      expect(response).to.equal('foo');
    });
  });

  describe('Error Handling:', () => {
    it('should bubble up the promise rejection from the callback.', async () => {
      const callback = () => {
        globalStore.set({ foo: 'foo' });

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject('Hello world');
          }, 1);
        });
      };

      try {
        await globalStore.initialize(adapter)(callback);
        expect.fail('Should not reach here.');
      } catch (e) {
        expect(e).to.equal('Hello world');
      }
    });

    it('should bubble up the error thrown from the callback.', (done) => {
      const callback = () => {
        globalStore.set({ foo: 'foo' });

        throw new Error('Hello world');
      };

      try {
        globalStore.initialize(adapter)(callback);
        expect.fail('Should not reach here.');
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).to.equal('Hello world');
        }
      }

      done();
    });
  });
});
