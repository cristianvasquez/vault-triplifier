import { simpleAst } from 'docs-and-graphs'
import { astTriplifier } from './triplifiers/astTriplifier.js'
import * as z from "zod/v4";

const MarkdownOptions = z.object({
  splitOnTag: z.boolean(),
  splitOnHeader: z.boolean(),
  splitOnId: z.boolean(),
  addLabels: z.boolean(),
  includeSelectors: z.boolean(),
  includeRaw: z.boolean(),
});

const defaultOptions = {
  splitOnTag: false,
  splitOnHeader: false,
  splitOnId: true,
  addLabels: false,
  includeSelectors: true, // A selector for a portion of the resource
  includeRaw: false,
}

function markdownToRDF (fullText, { pointer, path }, options = {}) {
  const node = simpleAst(fullText,
    { normalize: true, inlineAsArray: true, includePosition: true })
  return astTriplifier(node, {
    pointer, path, text: fullText,
  }, { ...defaultOptions, ...options })

}

export { markdownToRDF }
