import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { TriplifierOptions } from '../schemas.js'

function createMapper(optionsInput) {
  // Validate and normalize options
  const options = TriplifierOptions.parse(optionsInput)
  const { prefix, mappings } = options

  // Build namespace map
  const namespaceMap = { ...ns }
  Object.entries(prefix).forEach(([pfx, uri]) => {
    namespaceMap[pfx] = rdf.namespace(uri)
  })

  // mappings are now a simple { label: 'prefix:term' } object
  const propertyMap = { ...mappings }

  function resolve(value) {
    if (value?.termType) return value
    if (typeof value !== 'string') return null

    // Check property mappings first
    if (propertyMap[value]) {
      const mapped = propertyMap[value]
      const resolved = resolvePrefixed(mapped)
      return resolved || rdf.namedNode(mapped)
    }

    // Try to resolve as prefixed term
    return resolvePrefixed(value)
  }

  function resolvePrefixed(str) {
    if (typeof str !== 'string') return null

    const colonIndex = str.indexOf(':')
    if (colonIndex === -1) return null

    const prefix = str.slice(0, colonIndex)
    const localName = str.slice(colonIndex + 1)

    return namespaceMap[prefix]?.[localName] ?? null
  }

  return ({ subject, predicate, object }) => ({
    resolvedSubject: resolve(subject),
    resolvedPredicate: resolve(predicate),
    resolvedObject: resolve(object),
  })
}

export { createMapper }
