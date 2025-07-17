import { strict as assert } from 'assert'
import { peekMarkdown, peekDefault } from '../../src/peekOptions.js'
import { triplify } from '../../src/triplifier.js'

describe('peekOptions', () => {
  describe('peekMarkdown', () => {
    it('should parse frontmatter and merge mappings with defaults', () => {
      const content = `---
uri: http://example.org
mappings:
  "custom prop": "schema:name"
---
# Test`
      
      const result = peekMarkdown(content)
      
      assert.equal(result.uri, 'http://example.org')
      assert.equal(result.mappings['is a'], 'rdf:type') // default mapping preserved
      assert.equal(result.mappings['same as'], 'rdfs:sameAs') // default mapping preserved
      assert.equal(result.mappings['custom prop'], 'schema:name') // frontmatter mapping added
    })

    it('should filter out unrecognized frontmatter options', () => {
      const content = `---
uri: http://example.org
unknownOption: "should be ignored"
mappings:
  "test": "schema:test"
---
# Test`
      
      const result = peekMarkdown(content)
      
      assert.equal(result.uri, 'http://example.org')
      assert.equal(result.mappings['test'], 'schema:test')
      assert.equal(result.unknownOption, undefined)
    })

    it('should handle malformed frontmatter gracefully', () => {
      const content = `---
uri: http://example.org
mappings:
  invalid yaml: [unclosed
--
# Test`
      
      // Should not throw and should fallback to defaults
      const result = peekMarkdown(content)
      
      assert.equal(result.mappings['is a'], 'rdf:type')
      assert.equal(result.mappings['same as'], 'rdfs:sameAs')
    })

    it('should merge explicit options with highest priority', () => {
      const content = `---
uri: http://frontmatter.org
includeRaw: true
---
# Test`
      
      const result = peekMarkdown(content, { 
        uri: 'http://explicit.org',
        includeRaw: false 
      })
      
      assert.equal(result.uri, 'http://explicit.org') // explicit wins
      assert.equal(result.includeRaw, false) // explicit wins
    })

    it('should handle your specific example', () => {
      const content = `---
hello: world
uri: http://example.org
---

# Alice

Alice inherits the URI`
      
      const result = peekMarkdown(content, {})
      
      assert.equal(result.uri, 'http://example.org')
      assert.equal(result.mappings['is a'], 'rdf:type') // default mapping preserved
      assert.equal(result.mappings['same as'], 'rdfs:sameAs') // default mapping preserved
      // hello should be filtered out as unrecognized
      assert.equal(result.hello, undefined)
    })
  })

  describe('peekDefault', () => {
    it('should return parsed options with defaults', () => {
      const result = peekDefault('any content', { uri: 'http://test.org' })
      
      assert.equal(result.uri, 'http://test.org')
      assert.equal(result.mappings['is a'], 'rdf:type')
      assert.equal(result.includeRaw, false)
    })
  })
})