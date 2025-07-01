import ns from '../namespaces.js'
import { getNameFromPath } from '../strings/uris.js'
import { pathFromUri, propertyFromUri } from '../termMapper/termMapper.js'

function addLabels(pointer, options) {
  if (!options.addLabels) return pointer

  const hasLabel = (term) => !!pointer.node(term).out(ns.schema.name).terms.length

  const getLabelForTerm = (term) => {
    if (term.termType === 'Literal' || hasLabel(term)) return null
    
    const path = pathFromUri(term, options)
    if (path) return getNameFromPath(path)
    
    return propertyFromUri(term, options)
  }

  const addLabelToTerm = (term) => {
    const label = getLabelForTerm(term)
    if (label) {
      pointer.node(term).addOut(ns.schema.name, label)
    }
  }

  for (const quad of pointer.dataset) {
    addLabelToTerm(quad.subject)
    addLabelToTerm(quad.predicate)
    addLabelToTerm(quad.object)
  }

  return pointer
}

export { addLabels }