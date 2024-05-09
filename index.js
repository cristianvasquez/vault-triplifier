import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { canvasToRDF } from './src/canvas-to-RDF.js'
import { createVaultFromDir } from './src/indexers/vault.js'
import { markdownToRDF } from './src/markdown-to-RDF.js'
import { postProcess } from './src/postProcess.js'
import { pathWithoutTrail } from './src/strings/uris.js'
import { createTermMapper } from './src/termMapper/defaultTermMapper.js'

const shouldParse = (contents) => (typeof contents === 'string' ||
  contents instanceof String)

async function createTriplifier (dir) {

  if (!dir) {
    throw Error('Requires a directory')
  }

  const { getPathByName, getFiles, getDirectories } = await createVaultFromDir(
    dir)

  const termMapper = createTermMapper({
    getPathByName,
  })

  const getMarkdownFiles = () => getFiles().filter(x => x.endsWith('.md')).
    map(pathWithoutTrail)

  const getCanvasFiles = () => getFiles().filter(x => x.endsWith('.canvas')).
    map(pathWithoutTrail)

  return {
    getMarkdownFiles,
    getCanvasFiles,
    getFiles,
    getDirectories,
    termMapper,
    toRDF: fromTermMapper(termMapper),
  }

}

function fromTermMapper (termMapper) {

  function populatePointer (contents, context, options) {
    const { path } = context
    if (!path) {
      throw Error('Requires a path')
    }

    if (!options.baseNamespace) {
      throw Error('Requires baseNamespace')
    }

    const term = termMapper.pathToUri(path, options)
    const pointer = grapoi({ dataset: rdf.dataset(), factory: rdf, term })

    if (path.endsWith('.canvas')) {
      const json = shouldParse(contents) ? JSON.parse(contents) : contents
      return canvasToRDF(json, { termMapper, pointer, path }, options)
    } else if (path.endsWith('.md')) {
      return markdownToRDF(contents, { termMapper, pointer, path }, options)
    } else {
      console.log('I don\'t know how to triplify', path)
      return pointer
    }
  }

  function toRDF (contents, context, options) {
    const pointer = populatePointer(contents, context, options)
    return pointer ? postProcess({ termMapper, pointer }, options) : pointer
  }

  return toRDF
}

export { fromTermMapper, createTriplifier }

