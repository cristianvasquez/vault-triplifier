import { triplify } from './index.js'

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

console.log('Testing custom URI support in header-based partitions...')

const { dataset } = triplify('/test.md', testContent, {
  partitionBy: ['headers-h2-h3']
})

const triples = [...dataset]

// Find annotations
const annotations = triples.filter(quad => 
  quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
  quad.object.value === 'http://www.w3.org/ns/oa#Annotation'
)

console.log('\nFound annotations:')
annotations.forEach(quad => {
  console.log('  Subject:', quad.subject.value)
})

// Check for custom URIs
const hasCustomUri1 = annotations.some(quad => quad.subject.value === 'urn:some:1')
const hasCustomUri2 = annotations.some(quad => quad.subject.value === 'urn:some:2')
const hasDefaultUri3 = annotations.some(quad => quad.subject.value.includes('Element%203'))

console.log('\nTest Results:')
console.log('  Element 1 uses custom URI <urn:some:1>:', hasCustomUri1)
console.log('  Element 2 uses custom URI <urn:some:2>:', hasCustomUri2) 
console.log('  Element 3 uses default URI pattern:', hasDefaultUri3)

// Verify that uri:: declarations don't create RDF triples
const uriTriples = triples.filter(quad => 
  quad.predicate.value.includes('uri')
)
console.log('  URI properties should not create RDF triples:', uriTriples.length === 0)

console.log('\nAll triples:')
triples.forEach(quad => {
  console.log(`  ${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`)
})