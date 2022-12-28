import { normalize, parse } from 'path'
import rdf from 'rdf-ext'

const DEFAULT_NAMESPACE = rdf.namespace('http://www.vault/')
import { isValidUrl } from '../triplifiers/strings.js'

// The main function to get URIs from paths
function uriFromPath (path, { baseNamespace }) {
  return baseNamespace[encodeURI(normalize(path))]
}

function getUriFromName (fullName, { namesPaths, baseNamespace }) {

  const { dir, name, ext } = parse(fullName)
  if (dir) {
    // The Obsidian interface ensures the following: if there are two notes with the same name, use the full path.
    // It's an absolute path, we don't look up
    const path = `${name}${ext ?? '.md'}`  // Normally .md are omitted
    return uriFromPath(path, { baseNamespace })
  } else if (namesPaths.has(name)) {
    // we look up otherwise
    const [path] = namesPaths.get(name)
    return uriFromPath(path, { baseNamespace })
  }

  console.log(`Warning, [${fullName}] not found`)
  return rdf.blankNode()
}

function createTermMapper (options = {}) {

  const baseNamespace = options.baseNamespace || DEFAULT_NAMESPACE
  const namesPaths = options.index?.namesPaths ?? new Map()
  const mappers = options.mappers || {}

  function maybeKnown (txt) {
    // If something is already in the known map, return it
    if (mappers[txt]) {
      return mappers[txt]
    }

    // If it's something like [[Bob | alias]], tries to find it in the index
    if (txt.startsWith('[[') && txt.endsWith(']]')) {
      const [name] = txt.replace(/^\[\[/, '').replace(/\]\]$/, '').split('|')
      return getUriFromName(name, { namesPaths, baseNamespace })
    }

    if (isValidUrl(txt)) {
      return rdf.namedNode(txt)
    }
  }

  function fromPath (path) {
    return uriFromPath(path, { baseNamespace })
  }

  function toTerm (txt) {
    return maybeKnown(txt) ?? rdf.literal(txt)
  }

  function toNamed (txt) {
    return maybeKnown(txt, options) ?? baseNamespace(encodeURI(txt))
  }

  return {
    toTerm, toNamed, fromPath,
  }

}

export {
  createTermMapper,
}
