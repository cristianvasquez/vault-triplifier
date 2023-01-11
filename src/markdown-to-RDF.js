import { simpleAst } from 'docs-and-graphs'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import { peekUri } from './triplifiers/specialData.js'

const defaultOptions = {
  splitOnTag: false,
  splitOnHeader: false,
  splitOnId: true,
  addLabels: false,
  includeWikipaths: true, // Real path to a resource
  includeSelectors: true, // A selector for a portion of the resource
}

function markdownToRDF (fullText, { termMapper, pointer, path }, options = {}) {

  const node = simpleAst(fullText, { normalize: true, inlineAsArray: true })

  const maybeUri = peekUri(node)
  return astTriplifier(node, {
    pointer: maybeUri ? pointer.node(maybeUri) : pointer, termMapper, path,
  }, { ...defaultOptions, ...options })

}

export { markdownToRDF }
