import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { canvasToRDF } from './canvas-to-RDF.js'
import { markdownToRDF } from './markdown-to-RDF.js'
import { pathToUri } from './termMapper/termMapper.js'

const processors = new Map([
  [
    '.canvas', (contents, context, options) => {
    const shouldParse = (contents) => (typeof contents === 'string' ||
      contents instanceof String)
    const json = shouldParse(contents) ? JSON.parse(contents) : contents
    return canvasToRDF(json, context, options)
  }],
  ['.md', markdownToRDF],
])

function getFileExtension (path) {
  const lastDot = path.lastIndexOf('.')
  return lastDot !== -1 ? path.substring(lastDot) : ''
}

function toRDF (contents, context, options) {
  const { path } = context
  if (!path) {
    throw Error('Requires a path')
  }

  if (!options.baseNamespace) {
    throw Error('Requires baseNamespace')
  }

  const term = pathToUri(path, options)
  const pointer = grapoi({ dataset: rdf.dataset(), factory: rdf, term })

  const extension = getFileExtension(path)
  const processor = processors.get(extension)

  if (processor) {
    return processor(contents, { pointer, path }, options)
  } else {
    console.log('I don\'t know how to triplify', path)
    return pointer
  }
}

export { toRDF }
