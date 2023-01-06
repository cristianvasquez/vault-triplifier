import { resolve } from 'path'
import rdf from '../rdf-ext.js'
import { isHTTP, pathWithoutTrail } from '../strings/uris.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    value, alias, ...getUri({ type, value }, context),
  }))
}

function getUri ({ type, value }, context) {
  const { termMapper } = context

  // Normal URL
  if (isHTTP(value)) {
    return { uri: rdf.namedNode(value) }
  } else if (type === 'wikiLink') {

    // Link-text
    if (value.startsWith('#')) {
      return {
        uri: termMapper.pathToUri(context.path),
        wikipath: context.path,
        // linktext: `${context.path}${value}`,
        label: value,
      }
    }

    const val = value.split('#').length === 1 ? value : value.split('#')[0]
    // Wiki-links
    const path = termMapper.getPathByName(val)
    const normalizedPath = pathWithoutTrail(path)
    if (path) {
      return {
        uri: termMapper.pathToUri(normalizedPath),
        linktext: value,
        // wikipath: normalizedPath,
        label: value,
      }
    } else {
      return { uri: rdf.blankNode() }
    }
  }

  // Relative links
  const resolvedPath = context.path
    ? `.${resolve('/', context.path, value)}`
    : value
  const normalizedPath = pathWithoutTrail(resolvedPath)
  return {
    uri: termMapper.pathToUri(normalizedPath), wikipath: normalizedPath,
  }
}

export { getKnownLinks }
