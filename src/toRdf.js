import { simpleAst } from 'docs-and-graphs'
import rdf from './rdf-ext.js'
import { getNameFromPath } from './strings/uris.js'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import ns from '../src/namespaces.js'

const defaultOptions = {
  splitOnTag: false,
  splitOnHeader: false,
  splitOnId: true,
  addLabels: false,
  includeWikiPaths: true,
}

function toRdf (fullText, { termMapper, documentUri, path }, options = {}) {

  if (!termMapper) {
    throw Error('Requires termMapper')
  }

  const term = documentUri ?? path
    ? termMapper.pathToUri(path)
    : rdf.blankNode()

  const pointer = rdf.clownface({ dataset: rdf.dataset(), term })

  if (!pointer.terms || pointer.terms.length !== 1) {
    throw Error('requires single-term pointer')
  }

  const _options = { ...defaultOptions, ...options }

  if (_options.includeWikiPaths) {
    pointer.addOut(ns.dot.wikiPath, rdf.literal(path))
  }

  try {
    const json = simpleAst(fullText, { normalize: true, inlineAsArray: true })
    const ptr = astTriplifier(json, {
      pointer, termMapper, path,
    }, _options)

    if (_options.addLabels) {
      // @TODO some profiling
      for (const quad of ptr.dataset) {
        addLabel(ptr, quad.subject, termMapper.pathUriMinter, getNameFromPath)
        addLabel(ptr, quad.predicate, termMapper.propertyUriMinter)
        addLabel(ptr, quad.object, termMapper.pathUriMinter, getNameFromPath)
      }
    }

    return ptr
  } catch (error) {
    console.log('could not triplify', path)
    console.error(error)
  }

}

function addLabel (ptr, term, uriMinter, func = (x) => x) {
  const hasLabel = (term) => !!ptr.node(term).out(ns.schema.name).terms.length
  if (uriMinter.belongs(term) && !hasLabel(term)) {
    const label = uriMinter.toValue(term)
    ptr.node(term).addOut(ns.schema.name, func(label))
  }
}

export { toRdf }
