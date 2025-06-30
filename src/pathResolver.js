import { glob } from 'glob'
import { getNameFromPath, pathWithoutTrail } from './strings/uris.js'

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

function createPathResolver(basePath, pattern = DEFAULT_SEARCH_PATTERN) {
  let nameToPathCache = null

  async function getPathByName(noteMD) {
    if (!nameToPathCache) {
      await buildCache()
    }
    
    const name = getNameFromPath(noteMD)
    const path = nameToPathCache.get(name)
    return path ? { path: pathWithoutTrail(path) } : undefined
  }

  async function buildCache() {
    const files = await glob(pattern, {
      cwd: basePath,
      nodir: true,
    })
    
    nameToPathCache = new Map()
    files.forEach(file => {
      const key = getNameFromPath(file)
      nameToPathCache.set(key, file)
    })
  }

  return { getPathByName }
}

export { createPathResolver }