import { strict as assert } from 'assert';
import { createMapper } from '../../src/termMapper/customMapper.js';
import ns from '../../src/namespaces.js';
import rdf from 'rdf-ext';

describe('customMapper', () => {
  const mockMappings = {
    namespaces: {
      ex: "http://example.org/",
      test: "http://test.com/"
    },
    mappings: [
      {
        type: "inlineProperty",
        key: "myProperty",
        predicate: "ex:customPredicate"
      },
      {
        type: "inlineProperty",
        key: "anotherProperty",
        predicate: "http://test.com/anotherPredicate"
      }
    ]
  };

  it('should map a key to a prefixed term from the JSON file', () => {
    const mapper = createMapper(mockMappings);
    const { resolvedPredicate } = mapper({ predicate: 'myProperty' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://example.org/customPredicate'));
  });

  it('should map a key to a full URI from the JSON file', () => {
    const mapper = createMapper(mockMappings);
    const { resolvedPredicate } = mapper({ predicate: 'anotherProperty' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://test.com/anotherPredicate'));
  });

  it('should return the original string for unmapped terms', () => {
    const mapper = createMapper(mockMappings);
    const { resolvedPredicate } = mapper({ predicate: 'unknownProperty' });
    assert.deepStrictEqual(resolvedPredicate, 'unknownProperty');
  });

  it('should resolve prefixed terms using namespaces from the JSON file', () => {
    const mapper = createMapper(mockMappings);
    const { resolvedPredicate } = mapper({ predicate: 'ex:someTerm' });
    assert.deepStrictEqual(resolvedPredicate, rdf.namedNode('http://example.org/someTerm'));
  });

  it('should resolve prefixed terms using default namespaces', () => {
    const mapper = createMapper(mockMappings);
    const { resolvedPredicate } = mapper({ predicate: 'rdf:type' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.type);
  });

  it('should return the original RDF term if already an RDF term', () => {
    const mapper = createMapper(mockMappings);
    const existingTerm = rdf.namedNode('http://example.com/someTerm');
    const { resolvedPredicate } = mapper({ predicate: existingTerm });
    assert.deepStrictEqual(resolvedPredicate, existingTerm);
  });
});
