import ns from './namespaces.js'
import { getNameFromPath } from './strings/uris.js'

function postProcess ({ pointer, termMapper }, options) {

  // @TODO some profiling
  for (const quad of pointer.dataset) {

    if (options.addLabels) {

      const hasLabel = (term) => !!pointer.node(term).
        out(ns.schema.name).terms.length

      function labelToAdd (term) {
        if (term.termType !== 'Literal' && !hasLabel(term)) {
          const path = termMapper.pathFromUri(term, options)
          if (path) {
            return getNameFromPath(path)
          }
          return termMapper.propertyFromUri(term, options)

        }
      }

      function addLabel (term) {
        const label = labelToAdd(term)
        if (label) {
          pointer.node(term).addOut(ns.schema.name, label)
        }
      }

      addLabel(quad.subject)
      addLabel(quad.predicate)
      addLabel(quad.object)

    }

  }
  return pointer
}

export { postProcess }
