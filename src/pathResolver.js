import { glob } from 'glob'
import { getNameFromPath, pathWithoutTrail } from './strings/uris.js'

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

async function createPathResolver (basePath, pattern = DEFAULT_SEARCH_PATTERN) {
  let nameToPathCache = new Map()
  await buildCache()

  async function buildCache () {
    const files = await glob(pattern, {
      cwd: basePath,
      nodir: true,
    })

    for (const file of files) {
      const name = getNameFromPath(file)
      nameToPathCache.set(name, file)
    }
  }

  function getPathByName (noteMD) {
    const name = getNameFromPath(noteMD)

    const filePath = nameToPathCache.get(name)
    return filePath ? { path: pathWithoutTrail(filePath) } : undefined
  }

  return {
    getPathByName,
    refreshCache: async () => {
      await buildCache()
    },
  }
}

export { createPathResolver }
