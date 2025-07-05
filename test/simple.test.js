import { strict as assert } from 'assert'
import { triplifyVault } from '../index.js'
import ns from '../src/namespaces.js'

describe('Vault Triplifier', () => {
  it('should process example vault and generate RDF', async () => {
    const options = {
      partitionBy: ['header'],
      includeLabelsFor: ['documents', 'sections', 'properties'],
    }

    const dataset = await triplifyVault('./example-vault', options)

    // Basic assertions
    assert(dataset.size > 0, 'Dataset should contain quads')

    // Check for expected triples
    const quads = [...dataset]
    const hasNoteTriple = quads.some(q =>
      q.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
      q.object.value === 'http://pkm-united.org/NamedNote',
    )
    assert(hasNoteTriple, 'Should contain NamedNote type triples')

  })

  it('should handle empty directory', async () => {
    const dataset = await triplifyVault('./nonexistent', {})
    assert.equal(dataset.size, 0,
      'Empty directory should produce empty dataset')
  })
})
