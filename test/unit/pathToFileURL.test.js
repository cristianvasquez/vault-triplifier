import { expect } from 'expect'
import { pathToFileURL } from '../../src/termMapper/termMapper.js'

describe('pathToFileURL - Node.js compatibility', () => {
  // Expected outputs based on Node.js pathToFileURL behavior
  const testCases = [
    // Unix absolute paths
    {
      input: '/home/user/file.md',
      expected: 'file:///home/user/file.md',
      description: 'Unix absolute path'
    },
    {
      input: '/home/user/file with spaces.md',
      expected: 'file:///home/user/file%20with%20spaces.md',
      description: 'Unix path with spaces'
    },
    {
      input: '/home/user/файл.md',
      expected: 'file:///home/user/%D1%84%D0%B0%D0%B9%D0%BB.md',
      description: 'Unix path with Unicode characters'
    },
    
    // Windows absolute paths (as they appear in Unix-like systems)
    {
      input: '/C:/Users/user/file.md',
      expected: 'file:///C:/Users/user/file.md',
      description: 'Windows absolute path (C: drive)'
    },
    {
      input: '/D:/Program Files/app/file.md',
      expected: 'file:///D:/Program%20Files/app/file.md',
      description: 'Windows path with spaces'
    },
    {
      input: '/C:/файл.md',
      expected: 'file:///C:/%D1%84%D0%B0%D0%B9%D0%BB.md',
      description: 'Windows path with Unicode'
    },
    
    // Relative paths (should be made absolute)
    {
      input: 'file.md',
      expected: 'file:///file.md',
      description: 'Simple relative path'
    },
    {
      input: 'folder/file.md',
      expected: 'file:///folder/file.md',
      description: 'Relative path with folder'
    },
    
    // Edge cases
    {
      input: '/path/with%percent.md',
      expected: 'file:///path/with%25percent.md',
      description: 'Path with percent character'
    },
    {
      input: '/path/with#hash.md',
      expected: 'file:///path/with%23hash.md',
      description: 'Path with hash character'
    }
  ]

  describe('should match Node.js pathToFileURL output', () => {
    testCases.forEach(({ input, expected, description }) => {
      it(`${description}: ${input}`, () => {
        const result = pathToFileURL(input)
        
        // Must always return NamedNode (this catches the bug)
        expect(result.termType).toBe('NamedNode')
        expect(typeof result.value).toBe('string')
        
        // Must match Node.js output exactly
        expect(result.value).toBe(expected)
      })
    })
  })

  describe('return type consistency', () => {
    it('should always return NamedNode objects, never strings', () => {
      const allInputs = testCases.map(tc => tc.input)
      
      for (const input of allInputs) {
        const result = pathToFileURL(input)
        
        // This is the critical test that would catch the Windows path bug
        expect(typeof result).toBe('object')
        expect(result.termType).toBe('NamedNode')
        expect(typeof result.value).toBe('string')
        expect(result.value.startsWith('file://')).toBe(true)
      }
    })
  })

  describe('Windows drive letter handling', () => {
    const windowsCases = [
      '/A:/file.md',
      '/B:/folder/file.md', 
      '/C:/Program Files/file.md',
      '/Z:/very/deep/folder/structure/file.md'
    ]

    windowsCases.forEach(path => {
      it(`should return NamedNode for Windows path: ${path}`, () => {
        const result = pathToFileURL(path)
        
        // The bug would cause this to fail for Windows paths
        expect(result.termType).toBe('NamedNode')
        expect(result.value.startsWith('file:///')).toBe(true)
        
        // Verify Windows drive letter is handled correctly
        expect(result.value).toMatch(/^file:\/\/\/[A-Z]:\//)
      })
    })
  })
})