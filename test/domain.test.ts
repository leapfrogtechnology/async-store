import 'mocha';
import { expect } from 'chai';
import * as domain from 'domain';

import * as globalStore from '../src';
import { STORE_KEY } from '../src/StoreDomain';
import AsyncStoreAdapter from '../src/AsyncStoreAdapter';

describe('store: [adapter=DOMAIN]', () => {
  const adapter = AsyncStoreAdapter.DOMAIN;

  beforeEach(() => {
    Object.assign(process, { domain: undefined });
  });

  describe('isInitialized()', () => {
    it('should return false when not initialized.', () => {
      expect(globalStore.isInitialized()).to.equal(false);
    });

    it('should return false when initialized but invoked out of the active domain.', done => {
      // Initialized
      globalStore.initialize(adapter)(() => null);

      setTimeout(() => {
        // Invoke it out of domain.
        expect(globalStore.isInitialized()).to.equal(false);
        done();
      }, 500);
    });

    it('should return true when initialized and invokved within the active domain.', done => {
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

    it('should return `undefined` if the value was not set.', done => {
      const callback = () => {
        expect(globalStore.get('foo')).to.equal(undefined);
        done();
      };

      globalStore.initialize(adapter)(callback);
    });
  });

  describe('set()', () => {
    it('should throw an error if store not initialized.', () => {
      expect(globalStore.set.bind(globalStore, {})).to.throw('Async store not initialized.');
    });

    it('should set properties in the store', done => {
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

    it('should merge and override existing properties if set multiple times.', done => {
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

    it('should merge and override existing properties recursively.', done => {
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
  });

  describe('Test Cases:', () => {
    it('should work with a chain of sequentially invoked callbacks (synchronous).', done => {
      const callback = () => {
        globalStore.set({ foo: 'foo' });

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

    it('should work with chain of promises resolved.', done => {
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
        globalStore.set({ foo: 'bar' });

        doSomething().then(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with chain of promises (resolved or rejected).', done => {
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

        doSomething()
          .then(done)
          .catch(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with Promise.all().', done => {
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

        doSomething()
          .then(done)
          .catch(done);
      };

      globalStore.initialize(adapter)(callback);
    });

    it('should work with setTimeout() based async callback chains.', done => {
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

    it('should work with setImmediate() based async callback chains.', done => {
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

    it('should work with process.nextTick() based async callback chains.', done => {
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

    it('should work with async and await based callbacks.', done => {
      const p1 = () => {
        return new Promise(resolve => {
          expect(globalStore.get('foo')).to.equal('foo');

          setTimeout(() => {
            expect(globalStore.get('foo')).to.equal('foo');
            resolve();
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

    it('should work with stores in different callback contexts loaded separately (dynamic import()).', done => {
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

    it("should work even if the store is initialized under active domain w/o affecting the existing domain's attributes.", done => {
      // Existing domain.
      const d = domain.create() as any;

      d.existingData = 'Hello world';

      const callback = () => {
        Promise.resolve()
          .then(first)
          .then(second)
          .then(third)
          .then(done)
          .catch(done);
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
  });
});
