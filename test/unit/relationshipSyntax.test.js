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

  // 2025-07-20
  it('should handle key holders and windows relationship syntax', () => {
    const content = `# Test

key holders :: [[Marco Romano]], [[Dr Emily Watson]] (emergency contact)
windows :: three windows facing street, two facing alley`

    const { dataset } = triplify('/test.md', content)
    
    const allTriples = [...dataset]
    
    // Should create some triples for this content
    assert.ok(allTriples.length > 0, 'Should create triples')
    
    // Generate expected URIs for the names
    const marcoUri = nameToUri('Marco Romano')
    const emilyUri = nameToUri('Dr Emily Watson')
    
    // Check if both entities are connected to the "key holders" relationship
    const keyHoldersPredicate = allTriples.find(quad => 
      quad.predicate.value.includes('key%20holders')
    )?.predicate
    
    assert.ok(keyHoldersPredicate, 'Should have key holders predicate')
    
    const hasMarcoRelationship = allTriples.some(quad => 
      quad.predicate.equals(keyHoldersPredicate) && quad.object.equals(marcoUri)
    )
    
    const hasEmilyRelationship = allTriples.some(quad => 
      quad.predicate.equals(keyHoldersPredicate) && quad.object.equals(emilyUri)
    )
    
    assert.ok(hasMarcoRelationship, 'Should have relationship for Marco Romano')
    assert.ok(hasEmilyRelationship, 'Should have relationship for Dr Emily Watson')
    
    // Check that windows property does not incorrectly link to the same entities
    const windowsPredicate = allTriples.find(quad => 
      quad.predicate.value.includes('windows')
    )?.predicate
    
    if (windowsPredicate) {
      const windowsHasMarcoRelationship = allTriples.some(quad => 
        quad.predicate.equals(windowsPredicate) && quad.object.equals(marcoUri)
      )
      
      const windowsHasEmilyRelationship = allTriples.some(quad => 
        quad.predicate.equals(windowsPredicate) && quad.object.equals(emilyUri)
      )
      
      assert.ok(!windowsHasMarcoRelationship, 'Windows should NOT have relationship for Marco Romano')
      assert.ok(!windowsHasEmilyRelationship, 'Windows should NOT have relationship for Dr Emily Watson')
    }
  })
})