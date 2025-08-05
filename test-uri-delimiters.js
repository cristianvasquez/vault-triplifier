// Quick test script to verify URI delimiter functionality
import { triplify } from './index.js'

console.log('Testing URI delimiters...')

// Test 1: Variable :: Value format
console.log('\n--- Test 1: Variable :: Value format ---')
const content1 = `# Test

website :: <http://example.com>
document :: <file:///path/to/file>`

try {
  const { dataset } = triplify('/test.md', content1)
  const allTriples = [...dataset]
  
  const websiteTriple = allTriples.find(quad => 
    quad.predicate.value.includes('website')
  )
  const documentTriple = allTriples.find(quad => 
    quad.predicate.value.includes('document')
  )
  
  console.log('Website triple object:', websiteTriple?.object)
  console.log('Document triple object:', documentTriple?.object)
  
  if (websiteTriple?.object.termType === 'NamedNode' && websiteTriple.object.value === 'http://example.com') {
    console.log('✅ Website URI correctly parsed as NamedNode')
  } else {
    console.log('❌ Website URI not correctly parsed')
  }
  
  if (documentTriple?.object.termType === 'NamedNode' && documentTriple.object.value === 'file:///path/to/file') {
    console.log('✅ Document URI correctly parsed as NamedNode')
  } else {
    console.log('❌ Document URI not correctly parsed')
  }
} catch (error) {
  console.log('❌ Error in test 1:', error.message)
}

// Test 2: Position-based format
console.log('\n--- Test 2: Position-based format ---')
const content2 = `# Test

<http://example.com/person> :: name :: John`

try {
  const { dataset } = triplify('/test.md', content2)
  const allTriples = [...dataset]
  
  const nameTriple = allTriples.find(quad => 
    quad.predicate.value.includes('name')
  )
  
  console.log('Name triple subject:', nameTriple?.subject)
  
  if (nameTriple?.subject.termType === 'NamedNode' && nameTriple.subject.value === 'http://example.com/person') {
    console.log('✅ Subject URI correctly parsed as NamedNode')
  } else {
    console.log('❌ Subject URI not correctly parsed')
  }
} catch (error) {
  console.log('❌ Error in test 2:', error.message)
}

console.log('\nTesting complete!')