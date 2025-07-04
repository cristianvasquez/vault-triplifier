import { strict as assert } from 'assert';
import { getMapper } from '../../src/termMapper/defaultCustomMapper.js';
import ns from '../../src/namespaces.js';
import rdf from 'rdf-ext';

describe('defaultCustomMapper', () => {
  it('should map "is a" to rdf:type', () => {
    const mapper = getMapper({ namespaces: ns });
    const { resolvedPredicate } = mapper({ predicate: 'is a' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.type);
  });

  it('should map "same as" to rdf:sameAs', () => {
    const mapper = getMapper({ namespaces: ns });
    const { resolvedPredicate } = mapper({ predicate: 'same as' });
    assert.deepStrictEqual(resolvedPredicate, ns.rdf.sameAs);
  });

  it('should map prefixed terms to their RDF equivalent', () => {
    const mapper = getMapper({ namespaces: ns });
    const { resolvedPredicate } = mapper({ predicate: 'schema:name' });
    assert.deepStrictEqual(resolvedPredicate, ns.schema.name);
  });

  it('should return the original string for unmapped terms', () => {
    const mapper = getMapper({ namespaces: ns });
    const { resolvedPredicate } = mapper({ predicate: 'unknownProperty' });
    assert.deepStrictEqual(resolvedPredicate, 'unknownProperty');
  });

  it('should return the original RDF term if already an RDF term', () => {
    const mapper = getMapper({ namespaces: ns });
    const existingTerm = rdf.namedNode('http://example.com/someTerm');
    const { resolvedPredicate } = mapper({ predicate: existingTerm });
    assert.deepStrictEqual(resolvedPredicate, existingTerm);
  });
});
