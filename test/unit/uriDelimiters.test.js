import { strict as assert } from 'assert'
import { triplify } from '../../index.js'
import rdf from 'rdf-ext'

describe('URI Delimiters', () => {
  describe('Variable :: Value format with URI in <>', () => {
    it('should treat <http://example.com> as named node', () => {
      const content = `# Test

website :: <http://example.com>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      // Find the website predicate triple
      const websiteTriple = allTriples.find(quad => 
        quad.predicate.value.includes('website')
      )

      assert.ok(websiteTriple, 'Should have website predicate')
      assert.equal(websiteTriple.object.termType, 'NamedNode', 'Object should be a NamedNode')
      assert.equal(websiteTriple.object.value, 'http://example.com', 'Should have correct URI value')
    })

    it('should treat <file:///path/to/file> as named node', () => {
      const content = `# Test

document :: <file:///path/to/file>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const documentTriple = allTriples.find(quad => 
        quad.predicate.value.includes('document')
      )

      assert.ok(documentTriple, 'Should have document predicate')
      assert.equal(documentTriple.object.termType, 'NamedNode', 'Object should be a NamedNode')
      assert.equal(documentTriple.object.value, 'file:///path/to/file', 'Should have correct URI value')
    })

    it('should handle multiple URI formats in angle brackets', () => {
      const content = `# Test

website :: <https://example.com>
ftp :: <ftp://server.com/file>
mailto :: <mailto:test@example.com>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const websiteTriple = allTriples.find(quad => 
        quad.predicate.value.includes('website')
      )
      const ftpTriple = allTriples.find(quad => 
        quad.predicate.value.includes('ftp')
      )
      const mailtoTriple = allTriples.find(quad => 
        quad.predicate.value.includes('mailto')
      )

      assert.ok(websiteTriple, 'Should have website predicate')
      assert.equal(websiteTriple.object.termType, 'NamedNode', 'Website should be NamedNode')
      assert.equal(websiteTriple.object.value, 'https://example.com')

      assert.ok(ftpTriple, 'Should have ftp predicate')
      assert.equal(ftpTriple.object.termType, 'NamedNode', 'FTP should be NamedNode')
      assert.equal(ftpTriple.object.value, 'ftp://server.com/file')

      assert.ok(mailtoTriple, 'Should have mailto predicate')
      assert.equal(mailtoTriple.object.termType, 'NamedNode', 'Mailto should be NamedNode')
      assert.equal(mailtoTriple.object.value, 'mailto:test@example.com')
    })

    it('should not affect URIs without angle brackets', () => {
      const content = `# Test

website :: https://example.com
document :: file:///path/to/file`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const websiteTriple = allTriples.find(quad => 
        quad.predicate.value.includes('website')
      )
      const documentTriple = allTriples.find(quad => 
        quad.predicate.value.includes('document')
      )

      // Website should be NamedNode (existing behavior for http/https)
      assert.ok(websiteTriple, 'Should have website predicate')
      assert.equal(websiteTriple.object.termType, 'NamedNode', 'HTTPS should remain NamedNode')

      // Document should be Literal (existing behavior for file:// without brackets)
      assert.ok(documentTriple, 'Should have document predicate')
      assert.equal(documentTriple.object.termType, 'Literal', 'file:// should remain Literal without brackets')
    })
  })

  describe('Position-based patterns with URIs in <>', () => {
    it('should handle subject as URI in <>', () => {
      const content = `# Test

<http://example.com/person> :: name :: John`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const nameTriple = allTriples.find(quad => 
        quad.predicate.value.includes('name')
      )

      assert.ok(nameTriple, 'Should have name predicate')
      assert.equal(nameTriple.subject.termType, 'NamedNode', 'Subject should be NamedNode')
      assert.equal(nameTriple.subject.value, 'http://example.com/person', 'Should have correct subject URI')
      assert.equal(nameTriple.object.value, 'John', 'Should have correct object value')
    })

    it('should handle object as URI in <>', () => {
      const content = `# Test

person :: knows :: <http://example.com/friend>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const knowsTriple = allTriples.find(quad => 
        quad.predicate.value.includes('knows')
      )

      assert.ok(knowsTriple, 'Should have knows predicate')
      assert.equal(knowsTriple.object.termType, 'NamedNode', 'Object should be NamedNode')
      assert.equal(knowsTriple.object.value, 'http://example.com/friend', 'Should have correct object URI')
    })

    it('should handle both subject and object as URIs in <>', () => {
      const content = `# Test

<http://example.com/person> :: knows :: <http://example.com/friend>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const knowsTriple = allTriples.find(quad => 
        quad.predicate.value.includes('knows')
      )

      assert.ok(knowsTriple, 'Should have knows predicate')
      assert.equal(knowsTriple.subject.termType, 'NamedNode', 'Subject should be NamedNode')
      assert.equal(knowsTriple.subject.value, 'http://example.com/person', 'Should have correct subject URI')
      assert.equal(knowsTriple.object.termType, 'NamedNode', 'Object should be NamedNode')
      assert.equal(knowsTriple.object.value, 'http://example.com/friend', 'Should have correct object URI')
    })

    it('should handle mixed scenarios with brackets and wiki links', () => {
      const content = `# Test

<http://example.com/person> :: knows :: [[Alice]]
[[Bob]] :: website :: <https://bob.example.com>`

      const { dataset } = triplify('/test.md', content)
      const allTriples = [...dataset]

      const knowsTriple = allTriples.find(quad => 
        quad.predicate.value.includes('knows') &&
        quad.subject.value === 'http://example.com/person'
      )
      const websiteTriple = allTriples.find(quad => 
        quad.predicate.value.includes('website')
      )

      assert.ok(knowsTriple, 'Should have knows predicate')
      assert.equal(knowsTriple.subject.termType, 'NamedNode', 'Subject should be NamedNode')
      assert.equal(knowsTriple.object.termType, 'NamedNode', 'Alice should be NamedNode')
      assert.ok(knowsTriple.object.value.includes('Alice'), 'Should reference Alice')

      assert.ok(websiteTriple, 'Should have website predicate')
      assert.ok(websiteTriple.subject.value.includes('Bob'), 'Subject should reference Bob')
      assert.equal(websiteTriple.object.termType, 'NamedNode', 'Website should be NamedNode')
      assert.equal(websiteTriple.object.value, 'https://bob.example.com', 'Should have correct website URI')
    })
  })
})