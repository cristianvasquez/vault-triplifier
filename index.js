import { createVaultFromDir } from './src/indexers/vault.js'
import ns from './src/namespaces.js'
import { createTermMapper } from './src/termMapper/defaultTermMapper.js'
import { toRdf } from './src/toRdf.js'

async function createTriplifier (dir, options = {}) {

  const vault = await createVaultFromDir(dir)
  const termMapper = createTermMapper({
    vault,
    customMapper: options.customMapper,
    baseNamespace: options.baseNamespace ?? ns.ex.vault,
  })

  return {
    vault,
    termMapper,
    toRdf: (text, context, options) => toRdf(text, { termMapper, ...context },
      options),
  }

}

export { toRdf, createTriplifier }

