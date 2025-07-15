import { strict as assert } from 'assert'
import { triplify } from '../../src/triplifier.js'
import ns from '../../src/namespaces.js'

describe('Code Block Options', () => {
  const baseContent = `# Test

\`\`\`turtle;triplify
<alice> <knows> <bob> .
\`\`\`

\`\`\`javascript
console.log('hello')
\`\`\``

  it('should parse turtle and include content by default', () => {
    const { dataset } = triplify('/test.md', baseContent)
    
    // Check turtle was parsed
    const turtleTriples = [...dataset].filter(quad => 
      quad.subject.value === 'alice' && 
      quad.predicate.value === 'knows' && 
      quad.object.value === 'bob'
    )
    assert.equal(turtleTriples.length, 1)
    
    // Check content is included for both blocks
    const contentTriples = [...dataset].filter(quad => 
      quad.predicate.equals(ns.dot.content)
    )
    assert.equal(contentTriples.length, 2)
  })

  it('should not include content when includeCodeBlockContent is false', () => {
    const { dataset } = triplify('/test.md', baseContent, {
      includeCodeBlockContent: false
    })
    
    // Check turtle was still parsed
    const turtleTriples = [...dataset].filter(quad => 
      quad.subject.value === 'alice'
    )
    assert.equal(turtleTriples.length, 1)
    
    // Check no content is included
    const contentTriples = [...dataset].filter(quad => 
      quad.predicate.equals(ns.dot.content)
    )
    assert.equal(contentTriples.length, 0)
  })

  it('should not parse turtle when parseCodeBlockTurtleIn is empty', () => {
    const { dataset } = triplify('/test.md', baseContent, {
      parseCodeBlockTurtleIn: []
    })
    
    // Check turtle was not parsed
    const turtleTriples = [...dataset].filter(quad => 
      quad.subject.value === 'alice'
    )
    assert.equal(turtleTriples.length, 0)
    
    // Check content is still included
    const contentTriples = [...dataset].filter(quad => 
      quad.predicate.equals(ns.dot.content)
    )
    assert.equal(contentTriples.length, 2)
  })

  it('should handle custom turtle languages', () => {
    const customContent = `# Test
\`\`\`rdf
<charlie> <likes> <diana> .
\`\`\``

    const { dataset } = triplify('/test.md', customContent, {
      parseCodeBlockTurtleIn: ['rdf']
    })
    
    // Check custom language was parsed
    const turtleTriples = [...dataset].filter(quad => 
      quad.subject.value === 'charlie'
    )
    assert.equal(turtleTriples.length, 1)
  })
})