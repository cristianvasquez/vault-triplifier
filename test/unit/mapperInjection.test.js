import { strict as assert } from 'assert';
import { triplifyFile } from '../../index.js';
import sinon from 'sinon';

describe('Mapper Injection', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call the provided mapper function with correct options when declarativeMappingsPath is not provided', async () => {
    const options = {};
    const mockFile = './example-vault/Alice.md';
    const mockMapperFn = sinon.stub().callsFake((options) => {
      return ({ subject, predicate, object }) => ({
        resolvedSubject: subject,
        resolvedPredicate: predicate,
        resolvedObject: object,
      });
    });

    await triplifyFile(mockFile, options, mockMapperFn);

    assert(mockMapperFn.calledOnceWith(sinon.match(options)), 'mockMapperFn should be called with options');
  });

  it('should call the provided mapper function with correct options when declarativeMappingsPath is provided', async () => {
    const options = {
      declarativeMappingsPath: './test/unit/mock-declarative-mappings.json',
    };
    const mockFile = './example-vault/Alice.md';
    const mockMapperFn = sinon.stub().callsFake((options) => {
      return ({ subject, predicate, object }) => ({
        resolvedSubject: subject,
        resolvedPredicate: predicate,
        resolvedObject: object,
      });
    });

    await triplifyFile(mockFile, options, mockMapperFn);

    assert(mockMapperFn.calledOnceWith(sinon.match(options)), 'mockMapperFn should be called with options');
  });
});
