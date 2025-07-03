import { glob } from 'glob'
import { getNameFromPath, pathWithoutTrail } from './strings/uris.js'

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

async function createPathResolver(basePath, pattern = DEFAULT_SEARCH_PATTERN) {
  const nameToPath = new Map()

  async function refresh() {
    nameToPath.clear()

    const files = await glob(pattern, {
      cwd: basePath,
      nodir: true,
    })

    for (const file of files) {
      const name = getNameFromPath(file)
      nameToPath.set(name, file)
    }
  }

  function getPathByName(nameOrPath) {
    const name = getNameFromPath(nameOrPath)
    const filePath = nameToPath.get(name)

    return filePath
      ? { path: pathWithoutTrail(filePath) }
      : null
  }

  // Initialize cache
  await refresh()

  return {
    getPathByName,
    refresh
  }
}

export { createPathResolver }
