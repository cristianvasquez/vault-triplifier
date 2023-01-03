import { once } from 'events'
import pkg from 'glob'
import { pathWithoutTrail, getNameFromPath } from '../strings/uris.js'

const { Glob } = pkg

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

async function createVaultFromObsidian (app) {
  return {
    getPathByName: (
      noteMD, activePath) => app.metadataCache.getFirstLinkpathDest(noteMD,
      activePath),
  }
}

async function createVaultFromDir (basePath, pattern = DEFAULT_SEARCH_PATTERN) {
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
  function getPathByName (noteMD, activePath) {
    if (namesPaths.has(noteMD)) {
      const [path] = namesPaths.get(noteMD)
      return { path: pathWithoutTrail(path) }
    }
  }

  const getMarkdownFiles = () => files.filter(x => x.endsWith('.md')).
    map(pathWithoutTrail)

  const getCanvasFiles = () => files.filter(x => x.endsWith('.canvas')).
    map(pathWithoutTrail)

  return {
    directories, getPathByName, getMarkdownFiles, getCanvasFiles,
  }

}

export { createVaultFromDir, createVaultFromObsidian }
