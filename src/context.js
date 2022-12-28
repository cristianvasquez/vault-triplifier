import { once } from 'events'
import pkg from 'glob'
import { normalize, parse } from 'path'
import rdf from 'rdf-ext'

const { Glob } = pkg

const DEFAULT_SEARCH_PATTERN = './**/+(*.md|*.png|*.jpg|*.svg)'
const MARKDOWN_FILES_PATTERN = './**/+(*.md)'
const DEFAULT_NAMESPACE = rdf.namespace('http://www.vault/')

function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}

function getUriFromPath (path, { baseNamespace }) {
  return baseNamespace[encodeURI(normalize(path))]
}

function buildPropertyFromText (text, { mappers, baseNamespace }) {
  if (mappers && mappers[text]) {
    return mappers[text]
  }
  return baseNamespace[encodeURIComponent(
    text.replaceAll(' ', '-').toLowerCase())]
}

function getUriFromName (fullName, { namesPaths, baseNamespace }) {

  const { dir, name, ext } = parse(fullName)
  let uri = undefined
  if (dir) {
    // Obsidian's way.
    // If the label does not contain a path, it's unique.
    // It's an absolute path, we don't look up
    const path = `${name}${ext ?? '.md'}`  // Normally .md are omitted
    uri = getUriFromPath(path, { baseNamespace })
  } else if (namesPaths.has(name)) {
    // we look up otherwise
    const [path] = namesPaths.get(name)
    uri = getUriFromPath(path, { baseNamespace })
  } else {
    // console.log(`Warning, [${fullName}] not found`)
  }
  return uri
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
    cwd: basePath
  }), 'end'))[0].map(dir=>`./${dir.slice(0, -1)}`)
  return { namesPaths, files, directories }
}

function createUriResolver ({ index, mappers, baseNamespace }) {
  const { namesPaths } = index
  return {
    namedNode: rdf.namedNode,
    literal: rdf.literal,
    fallbackUris: {
      noTypeExternal: baseNamespace['has-url'],
      noTypeInternal: baseNamespace['linked-to'],
      noType: baseNamespace['related-to'],
      notFoundURI: baseNamespace['not-found-in-vault'],
    },
    buildPropertyFromText: (text) => buildPropertyFromText(text,
      { mappers, baseNamespace }),
    getUriFromPath: (path) => getUriFromPath(path, { baseNamespace }),
    getNameFromPath,
    getUriFromName: (name) => getUriFromName(name,
      { namesPaths, baseNamespace }),
  }
}

async function createContext ({ basePath, mappers, baseNamespace }) {
  const index = await buildIndex(basePath)
  const uriResolver = createUriResolver(
    { index, mappers, baseNamespace: baseNamespace ?? DEFAULT_NAMESPACE })
  return { basePath, mappers, baseNamespace, index, uriResolver }
}

export {
  createContext,
  DEFAULT_SEARCH_PATTERN,
  MARKDOWN_FILES_PATTERN,
  DEFAULT_NAMESPACE,
}
