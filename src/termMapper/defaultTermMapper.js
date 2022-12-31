import { normalize, parse } from 'path'
import rdf from '../rdf-ext.js'

import { isValidUrl } from '../triplifiers/strings.js'

function createTermMapper ({ baseNamespace, index, customMapper }) {

  // Build the uri starting from a path
  function uriFromPath (path) {
    return baseNamespace[encodeURI(normalize(path))]
  }

  // A named only can be a URI
  // This function build URIs from text, which is useful for properties
  // For example, "has name" -> http://some-vault/has-name
  function toNamed (txt) {
    const pretty = (txt) => txt.replaceAll(' ', '-').
      replaceAll('*', '').
      toLowerCase()
    return maybeKnownURI(txt, { index, customMapper }, uriFromPath) ??
      baseNamespace[encodeURI(pretty(txt))]
  }

  // A term can be a literal or a URI
  function toTerm (txt) {
    return maybeKnownURI(txt, { index, customMapper }, uriFromPath) ??
      rdf.literal(txt)
  }

  return {
    toTerm, toNamed, uriFromPath, blockUri,
  }

}

const blockUri = (uri, blockId) => rdf.namedNode(
  `${uri.value}/${blockId.replace(/^\^/, '')}`)

function maybeKnownURI (txt, { index, customMapper }, fromPath) {

  // Custom mapper function
  if (customMapper) {
    const mapped = customMapper(txt)
    if (mapped) {
      return mapped
    }
  }

  if (typeof txt === 'string') {

    // If it's something like [[Bob | alias]], tries to find it in the index
    if (txt.startsWith('[[') && txt.endsWith(']]')) {
      const [fullName] = txt.replace(/^\[\[/, '').
        replace(/\]\]$/, '').
        split('|')
      const [name, id] = fullName.split('#')
      const path = index ? getPathFromName(name, { index }) : undefined

      const uri = path ? fromPath(path) : rdf.blankNode(name)
      // Point to a sub-block if applies
      return (id && id.startsWith('^')) ? blockUri(uri, id) : uri
    }

    if (isValidUrl(txt)) {
      return rdf.namedNode(txt)
    }
  }
}

function getPathFromName (name, { index }) {
  const { namesPaths } = index

  if (namesPaths.has(name)) {
    const [path] = namesPaths.get(name)
    return path
  }
  // Perhaps has extension or dir
  const { dir, name: nameChunk, ext } = parse(name)
  if (dir) {
    // The Obsidian interface ensures the following: if there are two notes with the same name, use the full path.
    // It's an absolute path, we don't look up
    return `${nameChunk}${ext ?? '.md'}`  // Normally .md are omitted
  } else if (namesPaths.has(nameChunk)) {
    // we look up otherwise
    const [path] = namesPaths.get(nameChunk)
    return path
  }
}

export {
  createTermMapper,
}
