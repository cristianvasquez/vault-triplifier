import ns from './namespaces.js'
import { getNameFromPath } from './strings/uris.js'

function addLabels (ptr, termMapper) {
  // @TODO some profiling
  for (const quad of ptr.dataset) {
    addLabel(ptr, quad.subject, termMapper.pathUriMinter, getNameFromPath)
    addLabel(ptr, quad.predicate, termMapper.propertyUriMinter)
    addLabel(ptr, quad.object, termMapper.pathUriMinter, getNameFromPath)
  }
}

function addLabel (ptr, term, uriMinter, func = (x) => x) {
  const hasLabel = (term) => !!ptr.node(term).out(ns.schema.name).terms.length
  if (uriMinter.belongs(term) && !hasLabel(term)) {
    const label = uriMinter.toValue(term)
    ptr.node(term).addOut(ns.schema.name, func(label))
  }
}

export { addLabels }
