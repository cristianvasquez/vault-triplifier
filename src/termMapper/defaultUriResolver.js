import { normalize, parse } from 'path'
import rdf from '../rdf-ext.js'

import { isValidUrl } from '../triplifiers/strings.js'

const defaultOptions = {
  baseNamespace: rdf.namespace('http://www.vault/'), index: {
    namesPaths: new Map(),
  }, mappers: {},
}

function clean (txt) {
  return txt.replaceAll(' ', '-').replaceAll('*', '').toLowerCase()
}

function createTermMapper (options = {}) {

  const _options = { ...defaultOptions, ...options }

  function fromPath (path) {
    return uriFromPath(path, _options)
  }

  function toTerm (txt) {
    return maybeKnown(txt, _options) ?? rdf.literal(txt)
  }

  function toNamed (txt) {
    return maybeKnown(txt, _options) ??
      _options.baseNamespace(encodeURI(clean(txt)))
  }

  return {
    toTerm, toNamed, fromPath, blockUri,
  }

}

// The main function to get URIs from paths
function uriFromPath (path, options) {
  const { baseNamespace } = options
  return baseNamespace[encodeURI(normalize(path))]
}

function getUriFromName (name, options) {
  const { index, baseNamespace } = options
  const { namesPaths } = index
  const { dir, name: nameChunk, ext } = parse(name)
  if (dir) {
    // The Obsidian interface ensures the following: if there are two notes with the same name, use the full path.
    // It's an absolute path, we don't look up
    const path = `${nameChunk}${ext ?? '.md'}`  // Normally .md are omitted
    return uriFromPath(path, options)
  } else if (namesPaths.has(nameChunk)) {
    // we look up otherwise
    const [path] = namesPaths.get(nameChunk)
    return uriFromPath(path, options)
  }
  // console.log(`Warning, [${fullName}] not found`)
  return rdf.blankNode(name)
}

const blockUri = (uri, blockId) => rdf.namedNode(
  `${uri.value}/${blockId.replace(/^\^/, '')}`)

function maybeKnown (txt, options) {

  const { mappers } = options

  // If something is already in the known map, return it
  if (mappers[txt]) {
    return mappers[txt]
  }

  if (typeof txt === 'string') {

    // If it's something like [[Bob | alias]], tries to find it in the index
    if (txt.startsWith('[[') && txt.endsWith(']]')) {
      const [fullName] = txt.replace(/^\[\[/, '').
        replace(/\]\]$/, '').
        split('|')

      const [name, id] = fullName.split('#')

      const uri = getUriFromName(name, options)
      // Point to a sub-block if applies
      return (id && id.startsWith('^')) ? blockUri(uri, id) : uri
    }

    if (isValidUrl(txt)) {
      return rdf.namedNode(txt)
    }
  }
}

export {
  createTermMapper,
}
