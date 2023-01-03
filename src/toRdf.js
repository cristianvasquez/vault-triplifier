import { simpleAst } from 'docs-and-graphs'
import rdf from './rdf-ext.js'
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

  if (_options.addLabels) {
    pointer.addOut(ns.schema.name, rdf.literal(path))
  }
  if (_options.includeWikiPaths) {
    pointer.addOut(ns.dot.wikiPath, rdf.literal(path))
  }

  try {
    const json = simpleAst(fullText, { normalize: true, inlineAsArray: true })
    return astTriplifier(json, {
      pointer, termMapper, path,
    }, _options)
  } catch (error) {
    console.log('could not triplify', path)
    console.error(error)
  }

}

export { toRdf }
