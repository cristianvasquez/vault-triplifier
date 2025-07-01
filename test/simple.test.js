import { strict as assert } from 'assert'
import { triplifyVault } from '../index.js'
import ns from '../src/namespaces.js'

describe('Vault Triplifier', () => {
  it('should process example vault and generate RDF', async () => {
    const options = {
      splitOnHeader: true,
      baseNamespace: ns.ex,
      addLabels: true,
      namespaces: ns,
      includeWikipaths: true,
    }

    const dataset = await triplifyVault('./example-vault', options)
    
    // Basic assertions
    assert(dataset.size > 0, 'Dataset should contain quads')
    
    // Check for expected triples
    const quads = [...dataset]
    const hasNoteTriple = quads.some(q => 
      q.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      q.object.value === 'http://pkm-united.org/Note'
    )
    assert(hasNoteTriple, 'Should contain Note type triples')
    
    const hasWikipathTriple = quads.some(q => 
      q.predicate.value === 'http://pkm-united.org/wikipath'
    )
    assert(hasWikipathTriple, 'Should contain wikipath triples')
  })

  it('should handle empty directory', async () => {
    const dataset = await triplifyVault('./nonexistent', {})
    assert.equal(dataset.size, 0, 'Empty directory should produce empty dataset')
  })
})