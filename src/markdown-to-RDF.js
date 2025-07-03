import { simpleAst } from 'docs-and-graphs'
import { astTriplifier } from './triplifiers/astTriplifier.js'

const defaultOptions = {
  splitOnTag: false,
  splitOnHeader: false,
  splitOnId: true,
  addLabels: false,
  includeSelectors: true, // A selector for a portion of the resource
}

function markdownToRDF (fullText, { pointer, path }, options = {}) {
  const node = simpleAst(fullText,
    { normalize: true, inlineAsArray: true, includePosition: true })
  return astTriplifier(node, {
    pointer, path,
  }, { ...defaultOptions, ...options })

}

export { markdownToRDF }
