import { simpleAst } from 'docs-and-graphs'
import rdf from 'rdf-ext'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import { createTermMapper } from './termMapper/defaultUriResolver.js'

function toRdf (fullText, context = {},
  options = { splitOnTag: true, splitOnId: true, normalize: true }) {

  const termMapper = context.termMapper ?? createTermMapper()
  const term = context.path
    ? termMapper.fromPath(context.path)
    : rdf.blankNode()
  const pointer = context.pointer ??
    rdf.clownface({ dataset: rdf.dataset(), term })

  const json = simpleAst(fullText, options)
  return astTriplifier(json, { ...context, pointer, termMapper }, options)
}

export { toRdf }
