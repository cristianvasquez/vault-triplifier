import rdf from 'rdf-ext'
import ns from '../namespaces.js'

function createMapper(mappings) {
  // Build namespace map
  const namespaceMap = { ...ns }
  if (mappings.namespaces) {
    Object.entries(mappings.namespaces).forEach(([prefix, uri]) => {
      namespaceMap[prefix] = rdf.namespace(uri)
    })
  }

  // Build property mappings
  const propertyMap = {}
  if (mappings.mappings) {
    mappings.mappings.forEach(mapping => {
      if (mapping.type === 'inlineProperty') {
        propertyMap[mapping.key] = mapping.predicate
      }
    })
  }

  function resolve(value) {
    // Already an RDF term - return as-is
    if (value?.termType) {
      return value
    }

    // Check property mappings first
    if (propertyMap[value]) {
      const mapped = propertyMap[value]
      return resolvePrefixed(mapped) || rdf.namedNode(mapped)
    }

    // Try to resolve as prefixed term
    return resolvePrefixed(value) || value
  }

  function resolvePrefixed(str) {
    if (typeof str !== 'string') return null

    const colonIndex = str.indexOf(':')
    if (colonIndex === -1) return null

    const prefix = str.slice(0, colonIndex)
    const localName = str.slice(colonIndex + 1)
    
    return namespaceMap[prefix]?.[localName]
  }

  return ({ subject, predicate, object }) => ({
    resolvedSubject: resolve(subject),
    resolvedPredicate: resolve(predicate),
    resolvedObject: resolve(object)
  })
}

export { createMapper }