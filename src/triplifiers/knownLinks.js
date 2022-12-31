import { resolve } from 'path'
import rdf from '../rdf-ext.js'
import { isValidUrl } from './strings.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    named: getNamed({ type, value }, context), value, alias,
  }))
}

function getNamed ({ type, value }, context) {
  const { termMapper, path } = context

  // Normal URL
  if (isValidUrl(value)) {
    return rdf.namedNode(value)
  } else if (type === 'wikiLink') {
    // Wikilinks
    return termMapper.toNamed(`[[${value}]]`)
  }
  // Relative links
  const resolved = path ? `.${resolve('/', path, value)}` : value
  return termMapper.uriFromPath(resolved)
}

export { getKnownLinks }
