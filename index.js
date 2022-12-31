import { buildIndex } from './src/indexers/buildIndex.js'
import ns from './src/namespaces.js'
import { createTermMapper } from './src/termMapper/defaultTermMapper.js'
import { toRdf } from './src/toRdf.js'

async function createTriplifier (dir, options = {}) {

  const index = await buildIndex(dir)
  const termMapper = createTermMapper({
    index,
    customMapper: options.customMapper,
    baseNamespace: options.baseNamespace ?? ns.ex.vault,
  })

  return {
    index,
    termMapper,
    toRdf: (text, context, options) => toRdf(text, { termMapper, ...context },
      options),
  }

}

export { toRdf, createTriplifier }

