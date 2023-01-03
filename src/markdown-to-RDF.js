import { simpleAst } from 'docs-and-graphs'
import { astTriplifier } from './triplifiers/astTriplifier.js'

const defaultOptions = {
  splitOnTag: false,
  splitOnHeader: false,
  splitOnId: true,
  addLabels: false,
  includeWikipaths: true,
}

function markdownToRDF (fullText, { termMapper, pointer, path }, options = {}) {

  const json = simpleAst(fullText, { normalize: true, inlineAsArray: true })
  return astTriplifier(json, {
    pointer, termMapper, path,
  }, { ...defaultOptions, ...options })

}

export { markdownToRDF }
