import { simpleAst } from 'docs-and-graphs'
import rdf from 'rdf-ext'
import { astTriplifier } from './triplifiers/jsonTriplifier.js'
import { createUriResolver } from './uriResolver/defaultUriResolver.js'

function toRdf (
  fullText,
  context = {},
  options = { splitOnTag: true, normalize: true }) {

  const pointer = context.pointer ??
    rdf.clownface({ dataset: rdf.dataset(), term: rdf.blankNode() })
  const uriResolver = context.uriResolver ?? createUriResolver()

  const json = simpleAst(fullText, options)
  return astTriplifier(json, { pointer, uriResolver }, options)
}

export { toRdf }
