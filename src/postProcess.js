import ns from './namespaces.js'
import { getNameFromPath } from './strings/uris.js'

function postProcess ({ pointer, termMapper }, options) {
  // @TODO some profiling
  for (const quad of pointer.dataset) {

    if (options.addLabels) {
      addLabel(pointer, quad.subject, termMapper.pathUriMinter, getNameFromPath)
      addLabel(pointer, quad.predicate, termMapper.propertyUriMinter)
      addLabel(pointer, quad.object, termMapper.pathUriMinter, getNameFromPath)
    }

    if (options.includeWikipaths) {
      addWikipath(pointer, quad.subject, termMapper)
      addWikipath(pointer, quad.object, termMapper)
    }

  }
  return pointer
}

function addWikipath (pointer, term, termMapper) {
  const hasWikipath = (term) => !!pointer.node(term).
    out(ns.dot.wikipath).terms.length
  if (termMapper.pathUriMinter.belongs(term) && !hasWikipath(term)) {
    const path = termMapper.pathUriMinter.toValue(term)
    pointer.node(term).addOut(ns.dot.wikipath, path)
  }
}

function addLabel (pointer, term, uriMinter, func = (x) => x) {
  const hasLabel = (term) => !!pointer.node(term).
    out(ns.schema.name).terms.length
  if (uriMinter.belongs(term) && !hasLabel(term)) {
    const label = uriMinter.toValue(term)
    pointer.node(term).addOut(ns.schema.name, func(label))
  }
}

export { postProcess }
