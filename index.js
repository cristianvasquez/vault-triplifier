import { buildIndex } from './src/indexers/buildIndex.js'
import ns from './src/namespaces.js'
import { createTermMapper } from './src/termMapper/defaultUriResolver.js'
import { toRdf } from './src/toRdf.js'

const defaultOptions = {
  customMapper: (str) => undefined, baseNamespace: ns.ex.vault,
}

async function createTriplifier (dir, options = {}) {

  const index = await buildIndex(dir)
  const _options = { ...defaultOptions, ...options, index }
  const termMapper = createTermMapper(_options)

  return {
    toRdf: (text, context, options) => toRdf(text,
      { index, termMapper, ...context }, { ..._options, options }),
    index,
    termMapper,
  }

}

export { toRdf, createTriplifier }

