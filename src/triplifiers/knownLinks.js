import { resolve } from 'path'
import rdf from '../rdf-ext.js'
import { isValidUrl, pathWithoutTrail } from '../strings/uris.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    value, alias, ...getUri({ type, value }, context),
  }))
}

function getUri ({ type, value }, context) {
  const { termMapper, path, wikiPath } = context

  // Normal URL
  if (isValidUrl(value)) {
    return { uri: rdf.namedNode(value) }
  } else if (type === 'wikiLink') {
    // Wikilinks
    const path = termMapper.getFirstLinkpathDest(value)
    if (path) {
      const withoutTrailing = pathWithoutTrail(path)
      return {
        uri: termMapper.pathToUri(withoutTrailing), wikiPath: withoutTrailing,
      }
    } else {
      return { uri: rdf.blankNode() }
    }
  }

  // Relative links
  const resolvedPath = path ? `.${resolve('/', path, value)}` : value
  return { uri: termMapper.pathToUri(resolvedPath) }
}

export { getKnownLinks }
