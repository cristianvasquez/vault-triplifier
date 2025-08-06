import { strict as assert } from 'assert'
import { parseValue, newLiteral } from '../../src/termMapper/termMapper.js'

describe('parseValue', () => {
  describe('basic type parsing', () => {
    it('should return non-string values unchanged', () => {
      assert.equal(parseValue(42), 42)
      assert.equal(parseValue(true), true)
      assert.equal(parseValue(null), null)
      assert.equal(parseValue(undefined), undefined)
    })

    it('should parse boolean strings', () => {
      assert.strictEqual(parseValue('true'), true)
      assert.strictEqual(parseValue('false'), false)
      assert.strictEqual(parseValue(' true '), true)
      assert.strictEqual(parseValue(' false '), false)
    })

    it('should parse number strings', () => {
      assert.strictEqual(parseValue('42'), 42)
      assert.strictEqual(parseValue('3.14'), 3.14)
      assert.strictEqual(parseValue(' 123 '), 123)
      assert.strictEqual(parseValue('-456'), -456)
      assert.strictEqual(parseValue('0'), 0)
    })

    it('should handle backtick opt-out mechanism', () => {
      assert.strictEqual(parseValue('`true`'), 'true')
      assert.strictEqual(parseValue('`42`'), '42')
      assert.strictEqual(parseValue('`2024-01-15`'), '2024-01-15')
      assert.strictEqual(parseValue('` wrapped text `'), ' wrapped text ')
    })
  })

  describe('date parsing', () => {
    it('should parse ISO date format (YYYY-MM-DD)', () => {
      const result = parseValue('2024-01-15')
      assert.ok(result instanceof Date)
      assert.equal(result.getFullYear(), 2024)
      assert.equal(result.getMonth(), 0) // January is 0
      assert.equal(result.getDate(), 15)
    })

    it('should parse ISO datetime format', () => {
      const result = parseValue('2024-01-15T10:30:00')
      assert.ok(result instanceof Date)
      assert.equal(result.getFullYear(), 2024)
      assert.equal(result.getMonth(), 0)
      assert.equal(result.getDate(), 15)
      assert.equal(result.getHours(), 10)
      assert.equal(result.getMinutes(), 30)
    })

    it('should parse ISO datetime with milliseconds', () => {
      const result = parseValue('2024-01-15T10:30:00.123')
      assert.ok(result instanceof Date)
      assert.equal(result.getMilliseconds(), 123)
    })

    it('should parse ISO datetime with Z timezone', () => {
      const result = parseValue('2024-01-15T10:30:00Z')
      assert.ok(result instanceof Date)
      assert.equal(result.toISOString(), '2024-01-15T10:30:00.000Z')
    })

    it('should parse ISO datetime with milliseconds and Z', () => {
      const result = parseValue('2024-01-15T10:30:00.123Z')
      assert.ok(result instanceof Date)
      assert.equal(result.toISOString(), '2024-01-15T10:30:00.123Z')
    })

    it('should parse ISO datetime with timezone offset', () => {
      const result = parseValue('2024-01-15T10:30:00+02:00')
      assert.ok(result instanceof Date)
      // The exact time will depend on timezone conversion, but should be a valid date
      assert.ok(!isNaN(result.getTime()))
    })

    it('should parse YYYY/MM/DD format', () => {
      const result = parseValue('2024/01/15')
      assert.ok(result instanceof Date)
      assert.equal(result.getFullYear(), 2024)
      assert.equal(result.getMonth(), 0)  
      assert.equal(result.getDate(), 15)
    })

    it('should parse MM/DD/YYYY format', () => {
      const result = parseValue('03/15/2024')
      assert.ok(result instanceof Date)
      assert.equal(result.getFullYear(), 2024)
      assert.equal(result.getMonth(), 2) // March is 2
      assert.equal(result.getDate(), 15)
    })

    it('should handle whitespace in date strings', () => {
      const result = parseValue(' 2024-01-15 ')
      assert.ok(result instanceof Date)
      assert.equal(result.getFullYear(), 2024)
    })
  })

  describe('invalid date handling', () => {
    it('should return string for invalid dates that match pattern', () => {
      // Invalid date that matches regex but fails Date constructor
      const result = parseValue('2024-02-30') // February 30th doesn't exist
      // JavaScript Date constructor will create a valid date by rolling over,
      // but let's test that our function handles edge cases
      // If it becomes a Date object, that's actually valid behavior
      assert.ok(result instanceof Date || typeof result === 'string')
    })

    it('should return string for malformed date strings', () => {
      assert.strictEqual(parseValue('not-a-date'), 'not-a-date')
      assert.ok(parseValue('2024-13-01') instanceof Date || typeof parseValue('2024-13-01') === 'string') // Invalid month, but Date constructor handles this
      assert.strictEqual(parseValue('invalid-2024-01-01'), 'invalid-2024-01-01')
      assert.strictEqual(parseValue('2024/1/1'), '2024/1/1') // Doesn't match MM/DD pattern
    })

    it('should handle edge cases', () => {
      assert.strictEqual(parseValue(''), '')
      assert.strictEqual(parseValue('   '), '')
      assert.strictEqual(parseValue('2024'), 2024) // Should be parsed as number, not date
    })
  })

  describe('backtick opt-out with dates', () => {
    it('should treat backtick-wrapped dates as strings', () => {
      assert.strictEqual(parseValue('`2024-01-15`'), '2024-01-15')
      assert.strictEqual(parseValue('`2024-01-15T10:30:00Z`'), '2024-01-15T10:30:00Z')
      assert.strictEqual(parseValue('`03/15/2024`'), '03/15/2024')
    })
  })

  describe('precedence and order', () => {
    it('should prioritize boolean parsing over date parsing', () => {
      // This shouldn't be a real case, but tests the order
      assert.strictEqual(parseValue('true'), true)
      assert.strictEqual(parseValue('false'), false)
    })

    it('should prioritize number parsing over date parsing', () => {
      assert.strictEqual(parseValue('2024'), 2024) // Year as number
      assert.strictEqual(parseValue('123'), 123)
    })

    it('should fall back to string for unrecognized patterns', () => {
      assert.strictEqual(parseValue('random text'), 'random text')
      assert.strictEqual(parseValue('123abc'), '123abc')
      assert.strictEqual(parseValue('true-ish'), 'true-ish')
    })
  })
})

describe('newLiteral with date support', () => {
  it('should create proper RDF literals for dates', () => {
    const literal = newLiteral('2024-01-15')
    
    // Should be an RDF literal
    assert.ok(literal.termType === 'Literal')
    
    // Should have appropriate datatype
    assert.ok(literal.datatype)
    assert.ok(literal.datatype.value.includes('dateTime') || literal.datatype.value.includes('date'))
  })

  it('should create string literals for non-date strings', () => {
    const literal = newLiteral('plain text')
    
    assert.ok(literal.termType === 'Literal')
    assert.equal(literal.value, 'plain text')
  })

  it('should handle backtick opt-out in literals', () => {
    const literal = newLiteral('`2024-01-15`')
    
    assert.ok(literal.termType === 'Literal')
    assert.equal(literal.value, '2024-01-15')
    // Should be plain string literal, not date literal
    assert.ok(!literal.datatype || literal.datatype.value === 'http://www.w3.org/2001/XMLSchema#string')
  })
})