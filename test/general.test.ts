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
});
