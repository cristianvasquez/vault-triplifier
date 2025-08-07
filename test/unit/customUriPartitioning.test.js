import { strict as assert } from 'assert'
import { triplify } from '../../index.js'

describe('Custom URI Header Partitioning', () => {
  const testContent = `# Title

## Element 1

variable :: value 1
uri :: <urn:some:1>

## Element 2

variable :: value 2
uri :: <urn:some:2>

## Element 3

variable :: value 3
`

  it('should use custom URI when explicitly declared', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h2-h3']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have annotations with custom URIs
    const hasCustomUri1 = annotations.some(quad => quad.subject.value === 'urn:some:1')
    const hasCustomUri2 = annotations.some(quad => quad.subject.value === 'urn:some:2')
    
    assert.ok(hasCustomUri1, 'Element 1 should use custom URI <urn:some:1>')
    assert.ok(hasCustomUri2, 'Element 2 should use custom URI <urn:some:2>')
  })

  it('should use default URI pattern when no custom URI declared', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h2-h3']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Element 3 has no custom URI, should use default pattern
    const hasDefaultUri3 = annotations.some(quad => 
      quad.subject.value.includes('Element%203')
    )
    
    assert.ok(hasDefaultUri3, 'Element 3 should use default URI pattern')
  })

  it('should not create RDF triples for uri declarations', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h2-h3']
    })
    
    const triples = [...dataset]
    
    // Should not find any triples with 'uri' as predicate
    const uriTriples = triples.filter(quad => 
      quad.predicate.value.includes('uri') || quad.predicate.value.includes('urn:property:uri')
    )
    
    assert.strictEqual(uriTriples.length, 0, 'uri declarations should not create RDF triples')
  })

  it('should handle different custom URI formats', () => {
    const testContentVariousFormats = `# Title

## With Delimited URI
uri :: <http://example.org/custom1>

## With Plain URI
uri :: http://example.org/custom2

## With URN
uri :: <urn:example:custom3>
`

    const { dataset } = triplify('/test2.md', testContentVariousFormats, {
      partitionBy: ['headers-h2-h3']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    const hasHttpUri1 = annotations.some(quad => quad.subject.value === 'http://example.org/custom1')
    const hasHttpUri2 = annotations.some(quad => quad.subject.value === 'http://example.org/custom2')
    const hasUrnUri = annotations.some(quad => quad.subject.value === 'urn:example:custom3')
    
    assert.ok(hasHttpUri1, 'Should handle delimited HTTP URIs')
    assert.ok(hasHttpUri2, 'Should handle plain HTTP URIs') 
    assert.ok(hasUrnUri, 'Should handle delimited URN URIs')
  })
})