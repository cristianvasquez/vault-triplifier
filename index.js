import { buildIndex } from './src/indexers/buildIndex.js'
import ns from './src/namespaces.js'
import { createTermMapper } from './src/termMapper/defaultUriResolver.js'
import { toRdf } from './src/toRdf.js'

const defaultOptions = {
  mappers: {}, baseNamespace: ns.ex.vault,
}

async function createTriplifier (dir, options = {}) {
  const index = await buildIndex(dir)
  const _options = { ...defaultOptions, index, ...options }

  const termMapper = createTermMapper(_options)
  return {
    toRdf: (text, options) => toRdf(text, { termMapper, ...options }),
    index,
    termMapper
  }

}

export { toRdf, createTriplifier }

