import 'mocha';
import { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import { createRequest, createResponse } from 'node-mocks-http';

import * as globalStore from '../src';
import AsyncStoreAdapter from '../src/AsyncStoreAdapter';

type Imiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

describe('store: [adapter=DOMAIN] middleware', () => {
  const adapter = AsyncStoreAdapter.DOMAIN;

  // creates a ref
  const initMwr: Imiddleware = globalStore.initializeMiddleware(adapter);
  const initMwrElsePath: Imiddleware = globalStore.initializeMiddleware(); // for default param

  describe('initializeMiddleware()', () => {
    it('should return a function(), which is reference to middleware', () => {
      expect(initMwr).to.be.a('function');
      expect(initMwrElsePath).to.be.a('function');
    });

    it('should return 3 arguments', () => {
      expect(initMwr.length).to.equal(3);
      expect(initMwrElsePath.length).to.equal(3);
    });
  });

  describe('isInitialized()', () => {
    const [req, res] = [createRequest(), createResponse()];

    function checkStore(done: Mocha.Done) {
      const cbNext = () => {
        expect(globalStore.isInitialized()).to.equal(true);

        done();
      };

      initMwr(req, res, cbNext);
    }

    it('should return false when not initialized.', () => {
      expect(globalStore.isInitialized()).to.equal(false);
    });

    it('should return true when initialized', done => {
      checkStore(done);
    });

    it('should return true if store is already initialized', done => {
      checkStore(done);
    });
  });
});
