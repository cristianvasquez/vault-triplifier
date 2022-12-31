import { once } from 'events'
import pkg from 'glob'

const { Glob } = pkg

function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

async function createVault (basePath, pattern = DEFAULT_SEARCH_PATTERN) {
  const namesPaths = new Map()
  const { files, directories } = await index()

  function addFile (filePath) {
    const key = getNameFromPath(filePath)
    const paths = namesPaths.has(key) ? namesPaths.get(key) : new Set()
    paths.add(filePath)
    namesPaths.set(key, paths)
  }

  async function index () {
    const search = new Glob(pattern, {
      nodir: true, cwd: basePath,
    })
    search.on('match', filePath => {
      addFile(filePath)
    })
    const files = (await once(search, 'end'))[0]
    const directories = (await once(new Glob('**/', {
      nodir: false, cwd: basePath,
    }), 'end'))[0].map(dir => `./${dir.slice(0, -1)}`)
    return { files, directories }
  }

  // Should work with .md and without
  function getFirstLinkpathDest (noteMD, activePath) {
    if (namesPaths.has(noteMD)) {
      const [path] = namesPaths.get(noteMD)
      return path
    }
  }

  const getMarkdownFiles = () => files.filter(x => x.endsWith('.md'))

  return {
    files, directories, getFirstLinkpathDest, getMarkdownFiles
  }

}

export { createVault }
