import { resolve } from 'path'
import rdf from '../rdf-ext.js'
import { isValidUrl } from '../strings/uris.js'
import { pathWithoutTrail } from '../strings/uris.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    value, alias, ...getUri({ type, value }, context),
  }))
}

function getUri ({ type, value }, context) {
  const { termMapper, path } = context

  // Normal URL
  if (isValidUrl(value)) {
    return { uri: rdf.namedNode(value) }
  } else if (type === 'wikiLink') {
    // Wikilinks
    const path = termMapper.getPathByName(value)
    const normalizedPath = pathWithoutTrail(path)
    if (path) {
      return {
        uri: termMapper.pathToUri(normalizedPath),
        wikipath: normalizedPath,
        label: value,
      }
    } else {
      return { uri: rdf.blankNode() }
    }
  }

  // Relative links
  const resolvedPath = path ? `.${resolve('/', path, value)}` : value
  const normalizedPath = pathWithoutTrail(resolvedPath)
  return {
    uri: termMapper.pathToUri(normalizedPath), wikipath: normalizedPath,
  }
}

export { getKnownLinks }
