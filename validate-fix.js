import { getKnownLinks } from './src/processors/links.js'
import { encodeAsValidIri } from './src/utils/iriValidation.js'

// Test cases from the issue
const testCases = [
  {
    description: 'URL with pipe character (the main issue)',
    links: [{ type: 'external', value: 'https://www.youtube.com/watch?v=X3cf1U1dFGQ|12' }],
    expectedEncodedValue: 'https://www.youtube.com/watch?v=X3cf1U1dFGQ%7C12'
  },
  {
    description: 'Valid URL should remain unchanged',
    links: [{ type: 'external', value: 'https://example.com/valid-path' }],
    expectedEncodedValue: 'https://example.com/valid-path'
  },
  {
    description: 'URL with spaces',
    links: [{ type: 'external', value: 'https://example.com/path with spaces' }],
    expectedEncodedValue: 'https://example.com/path%20with%20spaces'
  }
]

console.log('Testing IRI validation fix...\n')

// Test the encoding function directly
console.log('=== Testing encodeAsValidIri function ===')
testCases.forEach((testCase, i) => {
  const input = testCase.links[0].value
  const result = encodeAsValidIri(input)
  const passed = result === testCase.expectedEncodedValue
  
  console.log(`Test ${i + 1}: ${testCase.description}`)
  console.log(`  Input:    ${input}`)
  console.log(`  Output:   ${result}`)
  console.log(`  Expected: ${testCase.expectedEncodedValue}`)
  console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log()
})

// Test the full link processing
console.log('=== Testing full link processing ===')
testCases.forEach((testCase, i) => {
  const context = { path: 'test.md' }
  const result = getKnownLinks(testCase.links, context)
  const uriValue = result[0].uri.value
  const passed = uriValue === testCase.expectedEncodedValue
  
  console.log(`Test ${i + 1}: ${testCase.description}`)
  console.log(`  Input:    ${testCase.links[0].value}`)
  console.log(`  URI:      ${uriValue}`)
  console.log(`  Expected: ${testCase.expectedEncodedValue}`)
  console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log()
})

console.log('Validation complete!')