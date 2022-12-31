import { resolve } from 'path'
import rdf from '../rdf-ext.js'
import { isValidUrl } from './strings.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    uri: getUri({ type, value }, context), value, alias,
  }))
}

function getUri ({ type, value }, context) {
  const { termMapper, path } = context

  // Normal URL
  if (isValidUrl(value)) {
    return rdf.namedNode(value)
  } else if (type === 'wikiLink') {
    // Wikilinks
    const path = termMapper.getFirstLinkpathDest(value)
    return path ? termMapper.pathToUri(path) : rdf.blankNode()
  }
  // Relative links
  const resolvedPath = path ? `.${resolve('/', path, value)}` : value
  return termMapper.pathToUri(resolvedPath)
}

export { getKnownLinks }
