import { strict as assert } from 'assert';
import { createMapper } from '../../src/termMapper/customMapper.js';
import ns from '../../src/namespaces.js';
import rdf from 'rdf-ext';

describe('defaultCustomMapper', () => {
  const testMappings = {
    namespaces: {
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      schema: "http://schema.org/"
    },
    mappings: [
      { type: "inlineProperty", key: "is a", predicate: "rdf:type" },
      { type: "inlineProperty", key: "same as", predicate: "rdf:sameAs" }
    ]
  };

  it('should map "is a" to rdf:type', () => {
    const mapper = createMapper(testMappings);
    const { resolvedPredicate } = mapper({ predicate: 'is a' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.type);
  });

  it('should map "same as" to rdf:sameAs', () => {
    const mapper = createMapper(testMappings);
    const { resolvedPredicate } = mapper({ predicate: 'same as' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.sameAs);
  });

  it('should map prefixed terms to their RDF equivalent', () => {
    const mapper = createMapper(testMappings);
    const { resolvedPredicate } = mapper({ predicate: 'schema:name' });
    assert.deepStrictEqual(resolvedPredicate, ns.schema.name);
  });

  it('should return the original string for unmapped terms', () => {
    const mapper = createMapper(testMappings);
    const { resolvedPredicate } = mapper({ predicate: 'unknownProperty' });
    assert.deepStrictEqual(resolvedPredicate, 'unknownProperty');
  });

  it('should return the original RDF term if already an RDF term', () => {
    const mapper = createMapper(testMappings);
    const existingTerm = rdf.namedNode('http://example.com/someTerm');
    const { resolvedPredicate } = mapper({ predicate: existingTerm });
    assert.deepStrictEqual(resolvedPredicate, existingTerm);
  });
});
