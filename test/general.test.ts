import 'mocha';
import { expect } from 'chai';

import * as globalStore from '../src';
import AsyncStoreAdapter from '../src/AsyncStoreAdapter';

describe('store: General', () => {
  beforeEach(() => {
    Object.assign(process, { domain: undefined });
  });

  it('should throw an error while initializing if unknown adapter passed.', () => {
    expect(globalStore.initialize.bind(globalStore, 'UNKNOWN_ADAPTER' as AsyncStoreAdapter)).to.throw(
      'Invalid async store adapter provided UNKNOWN_ADAPTER.'
    );
  });

  it('should throw an error when initialized multiple times.', () => {
    const callback = () => {
      // Try re-initializing the store and it should throw an error.
      expect(globalStore.initialize.bind(globalStore, AsyncStoreAdapter.DOMAIN)).to.throw(
        'Async store already initialized, cannot re-initialize again.'
      );
    };

    globalStore.initialize(AsyncStoreAdapter.DOMAIN)(callback);
  });
});
