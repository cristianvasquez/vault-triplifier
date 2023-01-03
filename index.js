import { addLabels } from './src/addLabels.js'
import { createVaultFromDir } from './src/indexers/vault.js'
import ns from './src/namespaces.js'
import rdf from './src/rdf-ext.js'
import { createTermMapper } from './src/termMapper/defaultTermMapper.js'
import { canvasToRDF } from './src/canvas-to-RDF.js'
import { markdownToRDF } from './src/markdown-to-RDF.js'

function fromTermMapper (termMapper) {
  function toRDF (contents, context, options) {

    const { path } = context

    if (!path) {
      throw Error('Requires a path')
    }

    const term = termMapper.pathToUri(path)
    const pointer = rdf.clownface({ dataset: rdf.dataset(), term })

    if (options.includeWikiPaths) {
      pointer.addOut(ns.dot.wikiPath, rdf.literal(path))
    }

    try {
      if (path.endsWith('.canvas')) {
        const json = shouldParse(contents) ? JSON.parse(contents) : contents
        canvasToRDF(json, { termMapper, pointer, path }, options)
      } else if (path.endsWith('.md')) {
        markdownToRDF(contents, { termMapper, pointer, path }, options)
      }
    } catch (error) {
      console.log('could not triplify', path)
      console.error(error)
    }

    if (options.addLabels) {
      addLabels(pointer, termMapper)
    }

    return pointer
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

