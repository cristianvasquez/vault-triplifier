import { strict as assert } from 'assert';
import { getMapper } from '../../src/termMapper/fileBasedCustomMapper.js';
import ns from '../../src/namespaces.js';
import rdf from 'rdf-ext';

describe('fileBasedCustomMapper', () => {
  const mockDeclarativeMappingsPath = './test/unit/mock-declarative-mappings.json';

  it('should map a key to a prefixed term from the JSON file', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const { resolvedPredicate } = mapper({ predicate: 'myProperty' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://example.org/customPredicate'));
  });

  it('should map a key to a full URI from the JSON file', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const { resolvedPredicate } = mapper({ predicate: 'anotherProperty' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://test.com/anotherPredicate'));
  });

  it('should return the original string for unmapped terms', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const { resolvedPredicate } = mapper({ predicate: 'unknownProperty' });
    assert.deepStrictEqual(resolvedPredicate, 'unknownProperty');
  });

  it('should resolve prefixed terms using namespaces from the JSON file', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const { resolvedPredicate } = mapper({ predicate: 'ex:someTerm' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://example.org/someTerm'));
  });

  it('should resolve prefixed terms using default namespaces', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const { resolvedPredicate } = mapper({ predicate: 'rdf:type' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.type);
  });

  it('should return the original RDF term if already an RDF term', async () => {
    const mapper = await getMapper({ declarativeMappingsPath: mockDeclarativeMappingsPath });
    const existingTerm = rdf.namedNode('http://example.com/someTerm');
    const { resolvedPredicate } = mapper({ predicate: existingTerm });
    assert.deepStrictEqual(resolvedPredicate, existingTerm);
  });
});
