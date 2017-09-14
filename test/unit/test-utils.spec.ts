import { expect } from 'chai';
import 'core-js';
import 'mocha';
import 'reflect-metadata';
import * as sinon from 'sinon';

before(() => sinon.stub(console, 'warn'));

export { expect };
