import { strict as assert } from 'assert'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { resolvePlaceholders } from '../src/processors/placeholderResolver.js'
import { addLabels } from '../src/processors/labelAdder.js'
import ns from '../src/namespaces.js'

describe('Processors', () => {
  describe('placeholderResolver', () => {
    it('should resolve placeholder URIs', () => {
      const dataset = rdf.dataset()
      const factory = rdf
      const pointer = grapoi({ dataset, factory })
      
      // Add a placeholder quad
      dataset.add(factory.quad(
        factory.namedNode('http://example.org/placeholder/TestNote'),
        factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        factory.namedNode('http://pkm-united.org/Note')
      ))
      
      const getPathByName = (name) => ({ path: 'resolved/path.md' })
      const options = { baseNamespace: ns.ex }
      
      resolvePlaceholders(pointer, getPathByName, options)
      
      const quads = [...dataset]
      assert(quads.length > 0, 'Should have quads after resolution')
    })
  })

  describe('labelAdder', () => {
    it('should add labels when addLabels is true', () => {
      const dataset = rdf.dataset()
      const factory = rdf
      const pointer = grapoi({ dataset, factory })
      
      // Add a test quad
      dataset.add(factory.quad(
        factory.namedNode('http://example.org/note/test.md'),
        factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        factory.namedNode('http://pkm-united.org/Note')
      ))
      
      const options = { addLabels: true, baseNamespace: ns.ex }
      
      addLabels(pointer, options)
      
      const quads = [...dataset]
      const hasLabel = quads.some(q => 
        q.predicate.value === 'http://schema.org/name'
      )
      assert(hasLabel, 'Should have added label triples')
    })

    it('should not add labels when addLabels is false', () => {
      const dataset = rdf.dataset()
      const factory = rdf
      const pointer = grapoi({ dataset, factory })
      
      dataset.add(factory.quad(
        factory.namedNode('http://example.org/note/test.md'),
        factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        factory.namedNode('http://pkm-united.org/Note')
      ))
      
      const originalSize = dataset.size
      const options = { addLabels: false, baseNamespace: ns.ex }
      
      addLabels(pointer, options)
      
      assert.equal(dataset.size, originalSize, 'Should not add any new triples')
    })
  })
})