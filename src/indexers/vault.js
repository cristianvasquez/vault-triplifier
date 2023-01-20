import { once } from 'events'
import pkg from 'glob'
import { getNameFromPath, pathWithoutTrail } from '../strings/uris.js'

const { Glob } = pkg

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

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
  // /bob/note
  // /bob/note.md
  // note
  // note.md
  function getPathByName (noteMD, activePath) {
    const name = getNameFromPath(noteMD)
    if (namesPaths.has(name)) {
      const [path] = [...namesPaths.get(name)]
      return { path: pathWithoutTrail(path) }
    }
  }

  const getFiles = () => files.map(pathWithoutTrail)
  const getDirectories = () => directories.map(pathWithoutTrail)

  return {
    getPathByName, getFiles, getDirectories,
  }

}

export { createVaultFromDir }
