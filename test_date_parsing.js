import { strict as assert } from 'assert'
import { parseValue, newLiteral, triplify } from './index.js'

// Test the parseValue function
function testParseValue() {
  console.log('Testing parseValue function:\n')
  
  // Test booleans
  assert.strictEqual(parseValue('true'), true)
  assert.strictEqual(parseValue('false'), false)
  assert.strictEqual(parseValue(' true '), true)
  assert.strictEqual(parseValue(' false '), false)
  
  // Test numbers
  assert.strictEqual(parseValue('42'), 42)
  assert.strictEqual(parseValue('3.14'), 3.14)
  assert.strictEqual(parseValue('0'), 0)
  assert.strictEqual(parseValue(' 42 '), 42)
  
  // Test dates
  const dateStr = '2023-12-25'
  const parsedDate = parseValue(dateStr)
  assert(parsedDate instanceof Date)
  assert.strictEqual(parsedDate.toISOString().substring(0, 10), '2023-12-25')
  
  const isoDateStr = '2023-12-25T10:30:00Z'
  const parsedIsoDate = parseValue(isoDateStr)
  assert(parsedIsoDate instanceof Date)
  assert.strictEqual(parsedIsoDate.toISOString(), '2023-12-25T10:30:00.000Z')
  
  // Test backtick opt-out
  assert.strictEqual(parseValue('`42`'), '42')
  assert.strictEqual(parseValue('`true`'), 'true')
  assert.strictEqual(parseValue('`2023-12-25`'), '2023-12-25')
  
  // Test regular strings
  assert.strictEqual(parseValue('hello world'), 'hello world')
  assert.strictEqual(parseValue('not a date'), 'not a date')
  
  console.log('✅ All parseValue tests passed!\n')
}

// Test the newLiteral function with typed literals
function testNewLiteral() {
  console.log('Testing newLiteral function:\n')
  
  // Test boolean literals
  const trueLiteral = newLiteral('true')
  assert.strictEqual(trueLiteral.value, 'true')
  assert(trueLiteral.datatype.value.includes('boolean'))
  
  // Test number literals
  const intLiteral = newLiteral('42')
  assert.strictEqual(intLiteral.value, '42')
  assert(intLiteral.datatype.value.includes('integer'))
  
  const decimalLiteral = newLiteral('3.14')
  assert.strictEqual(decimalLiteral.value, '3.14')
  
  // Test date literals
  const dateLiteral = newLiteral('2023-12-25')
  assert.strictEqual(dateLiteral.value, '2023-12-25T00:00:00.000Z')
  assert(dateLiteral.datatype.value.includes('dateTime'))
  
  // Test string literals (backtick opt-out)
  const stringLiteral = newLiteral('`42`')
  assert.strictEqual(stringLiteral.value, '42')
  assert(!stringLiteral.datatype) // Plain string literal has no datatype
  
  console.log('✅ All newLiteral tests passed!\n')
}

// Test integration with triplify
function testIntegration() {
  console.log('Testing integration with triplify:\n')
  
  const content = `# Test
  
age :: 25
active :: true
birthdate :: 2023-12-25
optOut :: \`42\`
name :: Alice`
  
  const { dataset } = triplify('/test.md', content)
  const triples = [...dataset]
  
  // Find triples by predicate
  const ageTriple = triples.find(t => t.predicate.value.includes('age'))
  const activeTriple = triples.find(t => t.predicate.value.includes('active'))
  const birthdateTriple = triples.find(t => t.predicate.value.includes('birthdate'))
  const optOutTriple = triples.find(t => t.predicate.value.includes('optOut'))
  const nameTriple = triples.find(t => t.predicate.value.includes('name'))
  
  // Check that proper typing is applied
  if (ageTriple) {
    assert.strictEqual(ageTriple.object.value, '25')
    assert(ageTriple.object.datatype.value.includes('integer'))
  }
  
  if (activeTriple) {
    assert.strictEqual(activeTriple.object.value, 'true')
    assert(activeTriple.object.datatype.value.includes('boolean'))
  }
  
  if (birthdateTriple) {
    assert(birthdateTriple.object.datatype.value.includes('dateTime'))
  }
  
  if (optOutTriple) {
    assert.strictEqual(optOutTriple.object.value, '42')
    assert(!optOutTriple.object.datatype) // Plain string
  }
  
  console.log('✅ All integration tests passed!\n')
}

// Run all tests
try {
  testParseValue()
  testNewLiteral()
  testIntegration()
  console.log('🎉 All tests passed! Date support has been successfully added.')
} catch (error) {
  console.error('❌ Test failed:', error.message)
  process.exit(1)
}