import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { propertyFromUri } from '../termMapper/termMapper.js'

function addLabels (pointer) {

  const hasLabel = (term) => !!pointer.node(term).
    out(ns.rdfs.label).terms.length

  const getLabelForTerm = (term) => {
    if (term.termType === 'Literal' || hasLabel(term)) return null

    return propertyFromUri(term)
  }

  const addLabelToTerm = (term) => {
    const label = getLabelForTerm(term)
    if (label) {
      pointer.node(term).addOut(ns.rdfs.label, rdf.literal(label))
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
