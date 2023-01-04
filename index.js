import { postProcess } from './src/postProcess.js'
import { createVaultFromDir } from './src/indexers/vault.js'
import ns from './src/namespaces.js'
import rdf from './src/rdf-ext.js'
import { createTermMapper } from './src/termMapper/defaultTermMapper.js'
import { canvasToRDF } from './src/canvas-to-RDF.js'
import { markdownToRDF } from './src/markdown-to-RDF.js'

function fromTermMapper (termMapper) {

  function populatePointer (contents, context, options) {
    const { path } = context
    if (!path) {
      throw Error('Requires a path')
    }
    const term = termMapper.pathToUri(path)
    const pointer = rdf.clownface({ dataset: rdf.dataset(), term })

    try {
      if (path.endsWith('.canvas')) {
        const json = shouldParse(contents) ? JSON.parse(contents) : contents
        return canvasToRDF(json, { termMapper, pointer, path }, options)
      } else if (path.endsWith('.md')) {
        return markdownToRDF(contents, { termMapper, pointer, path }, options)
      } else {
        console.log('I don\'t know how to triplify', path)
        return pointer
      }
    } catch (error) {
      console.log('could not triplify', path)
      console.error(error)
      return pointer
    }
  }

  function toRDF (contents, context, options) {
    const pointer = populatePointer(contents, context, options)
    return pointer ? postProcess({ termMapper, pointer }, options) : pointer
  }

  return toRDF
}

const shouldParse = (contents) => (typeof contents === 'string' ||
  contents instanceof String)

async function createTriplifier (dir, options = {}) {

  const vault = await createVaultFromDir(dir)
  const termMapper = createTermMapper({
    vault,
    customMapper: options.customMapper,
    baseNamespace: options.baseNamespace ?? ns.ex.vault,
  })

  return {
    vault, termMapper, toRDF: fromTermMapper(termMapper),
  }

}

export { fromTermMapper, createTriplifier }

