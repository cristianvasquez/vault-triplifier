import { simpleAst } from 'docs-and-graphs'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import { OptionsSchema } from './schemas.js'

function markdownToRDF (fullText, { pointer, path }, options = {}) {
  const node = simpleAst(fullText,
    { normalize: true, inlineAsArray: true, includePosition: true })
  return astTriplifier(node, {
    pointer, path, text: fullText,
  }, OptionsSchema.parse(options))

}

export { markdownToRDF }
