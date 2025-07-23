import { strict as assert } from 'assert'
import { peekMarkdown, peekDefault } from '../../src/peekOptions.js'
import { triplify } from '../../index.js'

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

    it('should overwrite boolean and array options instead of deep merging', () => {
      const content = `---
includeSelectors: false
includeCodeBlockContent: false
partitionBy: none
mappings:
  "custom prop": "schema:name"
---

# Test`

      const result = peekMarkdown(content, {})

      // These should be overwritten, not merged
      assert.equal(result.includeSelectors, false)
      assert.equal(result.includeCodeBlockContent, false)
      assert.deepEqual(result.partitionBy, []) // partitionBy: none becomes []

      // Mappings should be deep merged
      assert.equal(result.mappings['is a'], 'rdf:type') // default preserved
      assert.equal(result.mappings['same as'], 'rdfs:sameAs') // default preserved
      assert.equal(result.mappings['custom prop'], 'schema:name') // frontmatter added
    })

    it('should actually disable selectors when includeSelectors: false in frontmatter', () => {
      const contentWithSelectors = `---
includeSelectors: false
partitionBy: ["headers-all"]
---

# Test Document

Some content here.

## Section

More content.
`

      const contentWithoutFrontmatter = `# Test Document

Some content here.

## Section

More content.
`

      // Test with frontmatter includeSelectors: false
      const { dataset: datasetWithoutSelectors } = triplify('/test.md', contentWithSelectors)
      const triplesWithoutSelectors = [...datasetWithoutSelectors]
      const selectorsDisabled = triplesWithoutSelectors.filter(quad => 
        quad.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
      )

      // Test with default (should include selectors)
      const { dataset: datasetWithSelectors } = triplify('/test.md', contentWithoutFrontmatter, {
        partitionBy: ['headers-all']
      })
      const triplesWithSelectors = [...datasetWithSelectors]
      const selectorsEnabled = triplesWithSelectors.filter(quad => 
        quad.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
      )

      // Assertions
      assert.equal(selectorsDisabled.length, 0, 'Should have no selector triples when includeSelectors: false in frontmatter')
      assert.ok(selectorsEnabled.length > 0, 'Should have selector triples when includeSelectors is true (default)')
    })

    it('should allow frontmatter to override options parameter (includeSelectors)', () => {
      const contentFalseInFrontmatter = `---
includeSelectors: false
partitionBy: ["headers-all"]
---

# Test Document

Some content here.

## Section

More content.
`

      const contentTrueInFrontmatter = `---
includeSelectors: true
partitionBy: ["headers-all"]
---

# Test Document

Some content here.

## Section

More content.
`

      // Test 1: Frontmatter false should override options true
      const { dataset: dataset1 } = triplify('/test.md', contentFalseInFrontmatter, {
        includeSelectors: true,  // This should be overridden by frontmatter
        partitionBy: ['headers-all']
      })
      const triples1 = [...dataset1]
      const selectors1 = triples1.filter(quad => 
        quad.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
      )

      // Test 2: Frontmatter true should override options false
      const { dataset: dataset2 } = triplify('/test.md', contentTrueInFrontmatter, {
        includeSelectors: false,  // This should be overridden by frontmatter
        partitionBy: ['headers-all']
      })
      const triples2 = [...dataset2]
      const selectors2 = triples2.filter(quad => 
        quad.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
      )

      // Assertions
      assert.equal(selectors1.length, 0, 'Frontmatter includeSelectors: false should override options includeSelectors: true')
      assert.ok(selectors2.length > 0, 'Frontmatter includeSelectors: true should override options includeSelectors: false')
    })

    it('should handle string boolean values in frontmatter', () => {
      const contentWithStringBooleans = `---
includeSelectors: "false"
includeRaw: "true"
includeCodeBlockContent: "false"
partitionBy: ["headers-all"]
---

# Test Document

Some content here.

## Section

More content.
`

      // Test that string "false" and "true" are properly converted to booleans
      const { dataset } = triplify('/test.md', contentWithStringBooleans)
      const triples = [...dataset]
      
      const selectors = triples.filter(quad => 
        quad.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
      )

      // Should have no selectors because includeSelectors: "false" should be converted to false
      assert.equal(selectors.length, 0, 'String "false" should be converted to boolean false')
      
      // Test that the parsing worked by checking the options directly
      const result = peekMarkdown(contentWithStringBooleans)
      assert.strictEqual(result.includeSelectors, false, 'includeSelectors "false" should become boolean false')
      assert.strictEqual(result.includeRaw, true, 'includeRaw "true" should become boolean true')
      assert.strictEqual(result.includeCodeBlockContent, false, 'includeCodeBlockContent "false" should become boolean false')
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
