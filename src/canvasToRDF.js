import { addLabels } from './addLabels.js'
import rdf from './rdf-ext.js'
import { canvasTriplifier } from './triplifiers/canvasTriplifier.js'
import ns from '../src/namespaces.js'

const defaultOptions = {
  addLabels: false, includeWikiPaths: true,
}

function canvasToRDF (json, { termMapper, documentUri, path }, options = {}) {

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

    const ptr = canvasTriplifier(json, {
      pointer, termMapper, path,
    }, _options)

    if (_options.addLabels) {
      addLabels(ptr, termMapper)
    }

    return ptr
  } catch (error) {
    console.log('could not triplify canvas', path)
    console.error(error)
  }

}

export { canvasToRDF }
