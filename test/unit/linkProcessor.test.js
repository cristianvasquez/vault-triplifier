import { describe, it } from 'mocha'
import { expect } from 'expect'
import rdf from 'rdf-ext'
import { getKnownLinks } from '../../src/processors/links.js'

describe('Link Processor', () => {
  describe('external URL validation', () => {
    it('should handle valid external URLs', () => {
      const links = [
        { type: 'external', value: 'https://example.com' }
      ]
      const context = { path: 'test.md' }
      
      const result = getKnownLinks(links, context)
      
      expect(result).toHaveLength(1)
      expect(result[0].uri).toBeDefined()
      expect(result[0].type).toBe('external')
      expect(result[0].value).toBe('https://example.com')
    })

    it('should handle external URLs with pipe characters by encoding them', () => {
      const links = [
        { type: 'external', value: 'https://www.youtube.com/watch?v=X3cf1U1dFGQ|12' }
      ]
      const context = { path: 'test.md' }
      
      const result = getKnownLinks(links, context)
      
      expect(result).toHaveLength(1)
      expect(result[0].uri).toBeDefined()
      expect(result[0].type).toBe('external')
      expect(result[0].value).toBe('https://www.youtube.com/watch?v=X3cf1U1dFGQ|12')
      // The URI should be valid (pipe encoded as %7C)
      expect(result[0].uri.value).toBe('https://www.youtube.com/watch?v=X3cf1U1dFGQ%7C12')
    })

    it('should handle external URLs with other invalid IRI characters', () => {
      const testCases = [
        {
          input: 'https://example.com/path with spaces',
          expected: 'https://example.com/path%20with%20spaces'
        },
        {
          input: 'https://example.com/path[with]brackets',
          expected: 'https://example.com/path%5Bwith%5Dbrackets'
        },
        {
          input: 'https://example.com/path{with}braces',
          expected: 'https://example.com/path%7Bwith%7Dbraces'
        }
      ]

      testCases.forEach(({ input, expected }) => {
        const links = [{ type: 'external', value: input }]
        const context = { path: 'test.md' }
        
        const result = getKnownLinks(links, context)
        
        expect(result).toHaveLength(1)
        expect(result[0].uri.value).toBe(expected)
      })
    })

    it('should not modify valid IRIs', () => {
      const validIris = [
        'https://example.com/valid-path',
        'http://localhost:3000/api/data',
        'urn:uuid:12345678-1234-5678-9abc-123456789def'
      ]

      validIris.forEach(iri => {
        const links = [{ type: 'external', value: iri }]
        const context = { path: 'test.md' }
        
        const result = getKnownLinks(links, context)
        
        expect(result).toHaveLength(1)
        expect(result[0].uri.value).toBe(iri)
      })
    })
  })
})