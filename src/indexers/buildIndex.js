import { once } from 'events'
import pkg from 'glob'

const { Glob } = pkg

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg)'

function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}

async function buildIndex (basePath, pattern = DEFAULT_SEARCH_PATTERN) {
  const namesPaths = new Map()
  const search = new Glob(pattern, {
    nodir: true, cwd: basePath,
  })
  search.on('match', filePath => {
    const key = getNameFromPath(filePath)
    const paths = namesPaths.has(key) ? namesPaths.get(key) : new Set()
    paths.add(filePath)
    namesPaths.set(key, paths)
  })
  const files = (await once(search, 'end'))[0]
  const directories = (await once(new Glob('**/', {
    nodir: false,
    cwd: basePath,
  }), 'end'))[0].map(dir => `./${dir.slice(0, -1)}`)
  return { namesPaths, files, directories }
}

export { buildIndex }
