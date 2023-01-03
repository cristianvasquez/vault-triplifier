import ns from './namespaces.js'
import rdf from './rdf-ext.js'
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
      addWikiPath(pointer, quad.subject, termMapper)
      addWikiPath(pointer, quad.object, termMapper)
    }

  }
}

function addWikiPath (ptr, term, termMapper) {
  const hasWikiPath = (term) => !!ptr.node(term).
    out(ns.dot.wikipath).terms.length
  if (termMapper.pathUriMinter.belongs(term) && !hasWikiPath(term)) {
    const path = termMapper.pathUriMinter.toValue(term)

    termMapper.
    ptr.node(term).addOut(ns.dot.wikipath, path)
  }
}

function addLabel (ptr, term, uriMinter, func = (x) => x) {
  const hasLabel = (term) => !!ptr.node(term).out(ns.schema.name).terms.length
  if (uriMinter.belongs(term) && !hasLabel(term)) {
    const label = uriMinter.toValue(term)
    ptr.node(term).addOut(ns.schema.name, func(label))
  }
}

export { postProcess }
