import { strict as assert } from 'assert'
import { triplify, nameToUri } from '../../index.js'
import ns from '../../src/namespaces.js'

describe('Relationship Syntax', () => {
  it('should handle regular customers relationship syntax', () => {
    const content = `# Test

regular customers :: [[Dr Emily Watson]], [[Detective Sarah Chen]]`

    const { dataset } = triplify('/test.md', content)
    
    const allTriples = [...dataset]
    
    // Should create some triples for this content
    assert.ok(allTriples.length > 0, 'Should create triples')
    
    // Generate expected URIs for the names
    const emilyUri = nameToUri('Dr Emily Watson')
    const sarahUri = nameToUri('Detective Sarah Chen')
    
    // Check if both entities are connected to the "regular customers" relationship
    const regularCustomersPredicate = allTriples.find(quad => 
      quad.predicate.value.includes('regular%20customers')
    )?.predicate
    
    assert.ok(regularCustomersPredicate, 'Should have regular customers predicate')
    
    const hasEmilyRelationship = allTriples.some(quad => 
      quad.predicate.equals(regularCustomersPredicate) && quad.object.equals(emilyUri)
    )
    
    const hasSarahRelationship = allTriples.some(quad => 
      quad.predicate.equals(regularCustomersPredicate) && quad.object.equals(sarahUri)
    )
    
    assert.ok(hasEmilyRelationship, 'Should have relationship for Dr Emily Watson')
    assert.ok(hasSarahRelationship, 'Should have relationship for Detective Sarah Chen')
  })
})