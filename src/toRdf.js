import { simpleAst } from 'docs-and-graphs'
import rdf from 'rdf-ext'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import { createTermMapper } from './termMapper/defaultUriResolver.js'

const defaultOptions = { splitOnTag: false, splitOnId: true, normalize: true }

function toRdf (fullText, context = {}, options = {}) {

  const termMapper = context.termMapper ?? createTermMapper()
  const documentUri = context.path
    ? termMapper.fromPath(context.path)
    : rdf.blankNode()
  const pointer = context.pointer ??
    rdf.clownface({ dataset: rdf.dataset(), term: documentUri })

  const _options = { ...defaultOptions, ...options }

  try {
    const json = simpleAst(fullText, _options)
    return astTriplifier(json, { ...context, pointer, termMapper, documentUri },
      _options)
  } catch (error) {
    console.log('could not triplify', context.path)
  }

}

export { toRdf }
