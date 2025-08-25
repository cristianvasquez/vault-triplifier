import { expect } from 'expect'
import { triplify } from '../../index.js'
import { toTerm } from '../../src/utils/uris.js'

describe('File URI Support', () => {
  describe('toTerm function with file URIs', () => {
    it('should convert file URIs to NamedNode', () => {
      // toTerm now handles file URIs properly
      const term = toTerm('file:///home/user/test.md')
      expect(term).toBeTruthy()
      expect(term.termType).toBe('NamedNode')
      expect(term.value).toBe('file:///home/user/test.md')
    })

    it('should still handle http and urn URIs', () => {
      const httpTerm = toTerm('http://example.com')
      expect(httpTerm).toBeTruthy()
      expect(httpTerm.termType).toBe('NamedNode')
      
      const urnTerm = toTerm('urn:example:resource:123')
      expect(urnTerm).toBeTruthy()  
      expect(urnTerm.termType).toBe('NamedNode')
    })
  })

  describe('URI handling in different contexts', () => {
    it('should process markdown with file URI in frontmatter without crashing', () => {
      const content = `---
uri: file:///home/cvasquez/test
---

# 2025-08-25

Test content.`

      expect(() => {
        triplify('./test.md', content, { partitionBy: ['headers-all'] })
      }).not.toThrow()
    })

    it('should handle various URI schemes in frontmatter', () => {
      const testCases = [
        'file:///absolute/path/file.md',
        'http://example.com/resource',
        'https://secure.example.com/resource',
        'urn:example:resource:123',
        'ftp://ftp.example.com/file.txt',
        'mailto:user@example.com'
      ]

      for (const uri of testCases) {
        const content = `---
uri: ${uri}
---

# Test Header

Content here.`

        const result = triplify('./test.md', content, { partitionBy: ['headers-all'] })
        expect(result.ptrs[0]._term.termType).toBe('NamedNode')
        expect(result.ptrs[0]._term.value).toBe(uri)
      }
    })

    it('should create NamedNode for URIs in frontmatter', () => {
      const content = `---
uri: file:///home/user/test.md
---

# Test Header

Content here.`

      const result = triplify('./test.md', content)
      expect(result).toBeTruthy()
      expect(result.ptrs).toHaveLength(1)
      expect(result.ptrs[0]._term.termType).toBe('NamedNode')
      expect(result.ptrs[0]._term.value).toBe('file:///home/user/test.md')
    })

    it('should distinguish between frontmatter URIs and content URIs', () => {
      // Test with frontmatter file URI
      const contentWithFrontmatterUri = `---
uri: file:///frontmatter/concept/uri
---

# Test Content

Some content here.`

      const result = triplify('./test.md', contentWithFrontmatterUri)
      
      // The main concept should use the frontmatter URI as NamedNode
      expect(result.ptrs[0]._term.termType).toBe('NamedNode')
      expect(result.ptrs[0]._term.value).toBe('file:///frontmatter/concept/uri')

      // Test without frontmatter - should use default name-based URI
      const contentWithoutFrontmatter = `# Test Content

Some content here.`

      const resultDefault = triplify('./test.md', contentWithoutFrontmatter)
      
      // Should use the default name-based URI (not a file URI)
      expect(resultDefault.ptrs[0]._term.termType).toBe('NamedNode')
      expect(resultDefault.ptrs[0]._term.value).not.toMatch(/^file:/)
    })
  })
})