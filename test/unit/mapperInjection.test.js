import { strict as assert } from 'assert';
import { triplifyFile } from '../../index.js';

describe('Mapper Integration', () => {
  it('should use default mappings when no mappings are provided', async () => {
    const options = {};
    const mockFile = './test/test-vault/Alice.md';

    const result = await triplifyFile(mockFile, options);

    assert(result, 'triplifyFile should return a result');
    assert(result.dataset, 'result should have a dataset');
  });

  it('should use custom mappings when provided', async () => {
    const options = {
      mappings: {
        namespaces: { ex: "http://example.org/" },
        mappings: [{ type: "inlineProperty", key: "myProperty", predicate: "ex:customPredicate" }]
      },
    };
    const mockFile = './test/test-vault/Alice.md';

    const result = await triplifyFile(mockFile, options);

    assert(result, 'triplifyFile should return a result');
    assert(result.dataset, 'result should have a dataset');
  });
});
