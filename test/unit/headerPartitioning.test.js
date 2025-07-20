import { strict as assert } from 'assert'
import { triplify } from '../../index.js'

describe('Header Partitioning', () => {
  const testContent = `# H1 Header

Content under H1.

## H2 Header

Content under H2.

### H3 Header

Content under H3.

#### H4 Header

Content under H4.
`

  it('should partition by headers-h1-h2 (H1 and H2 only)', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h1-h2']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have annotations for H1 and H2, but not H3 or H4
    const hasH1 = annotations.some(quad => quad.subject.value.includes('H1%20Header'))
    const hasH2 = annotations.some(quad => quad.subject.value.includes('H2%20Header'))
    const hasH3 = annotations.some(quad => quad.subject.value.includes('H3%20Header'))
    const hasH4 = annotations.some(quad => quad.subject.value.includes('H4%20Header'))
    
    assert.ok(hasH1, 'Should include H1 header')
    assert.ok(hasH2, 'Should include H2 header')
    assert.ok(!hasH3, 'Should NOT include H3 header')
    assert.ok(!hasH4, 'Should NOT include H4 header')
  })

  it('should partition by headers-h2-h3 (H2 and H3 only)', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h2-h3']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have annotations for H2 and H3, but not H1 or H4
    const hasH1 = annotations.some(quad => quad.subject.value.includes('H1%20Header'))
    const hasH2 = annotations.some(quad => quad.subject.value.includes('H2%20Header'))
    const hasH3 = annotations.some(quad => quad.subject.value.includes('H3%20Header'))
    const hasH4 = annotations.some(quad => quad.subject.value.includes('H4%20Header'))
    
    assert.ok(!hasH1, 'Should NOT include H1 header')
    assert.ok(hasH2, 'Should include H2 header')
    assert.ok(hasH3, 'Should include H3 header')
    assert.ok(!hasH4, 'Should NOT include H4 header')
  })

  it('should partition by headers-h1-h2-h3 (H1, H2, and H3)', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h1-h2-h3']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have annotations for H1, H2, and H3, but not H4
    const hasH1 = annotations.some(quad => quad.subject.value.includes('H1%20Header'))
    const hasH2 = annotations.some(quad => quad.subject.value.includes('H2%20Header'))
    const hasH3 = annotations.some(quad => quad.subject.value.includes('H3%20Header'))
    const hasH4 = annotations.some(quad => quad.subject.value.includes('H4%20Header'))
    
    assert.ok(hasH1, 'Should include H1 header')
    assert.ok(hasH2, 'Should include H2 header')
    assert.ok(hasH3, 'Should include H3 header')
    assert.ok(!hasH4, 'Should NOT include H4 header')
  })

  it('should partition by headers-all (all header levels)', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-all']
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have annotations for all headers
    const hasH1 = annotations.some(quad => quad.subject.value.includes('H1%20Header'))
    const hasH2 = annotations.some(quad => quad.subject.value.includes('H2%20Header'))
    const hasH3 = annotations.some(quad => quad.subject.value.includes('H3%20Header'))
    const hasH4 = annotations.some(quad => quad.subject.value.includes('H4%20Header'))
    
    assert.ok(hasH1, 'Should include H1 header')
    assert.ok(hasH2, 'Should include H2 header')
    assert.ok(hasH3, 'Should include H3 header')
    assert.ok(hasH4, 'Should include H4 header')
  })

  it('should not partition headers when not in partitionBy array', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['identifier']  // Only identifier partitioning
    })
    
    const triples = [...dataset]
    const annotations = triples.filter(quad => 
      quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
    )
    
    // Should have no header annotations
    const hasAnyHeader = annotations.some(quad => 
      quad.subject.value.includes('Header')
    )
    
    assert.ok(!hasAnyHeader, 'Should not create annotations for headers when not partitioning by headers')
  })

  it('should create correct label relationships for headers', () => {
    const { dataset } = triplify('/test.md', testContent, {
      partitionBy: ['headers-h2-h3'],
      includeLabelsFor: ['sections']
    })
    
    const triples = [...dataset]
    
    // Check that H2 header has correct label
    const h2LabelTriple = triples.find(quad => 
      quad.subject.value.includes('H2%20Header') &&
      quad.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#label' &&
      quad.object.value === 'H2 Header'
    )
    
    // Check that H3 header has correct label
    const h3LabelTriple = triples.find(quad => 
      quad.subject.value.includes('H3%20Header') &&
      quad.predicate.value === 'http://www.w3.org/2000/01/rdf-schema#label' &&
      quad.object.value === 'H3 Header'
    )
    
    assert.ok(h2LabelTriple, 'Should create label for H2 header')
    assert.ok(h3LabelTriple, 'Should create label for H3 header')
  })
})