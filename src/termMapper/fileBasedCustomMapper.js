import rdf from 'rdf-ext'
import { loadMappings } from '../mappingLoader.js'
import ns from '../../src/namespaces.js'

async function getMapper(options = {}) {
  const { declarativeMappingsPath } = options
  if (!declarativeMappingsPath) {
    throw new Error('declarativeMappingsPath is required for fileBasedCustomMapper')
  }

  const declarativeMappings = await loadMappings(declarativeMappingsPath)

  const customMappings = declarativeMappings.mappings.reduce((acc, mapping) => {
    if (mapping.type === 'inlineProperty') {
      acc[mapping.key] = mapping.predicate
    }
    return acc
  }, {})

  const namespaces = Object.entries(declarativeMappings.namespaces).reduce((acc, [key, value]) => {
    acc[key] = rdf.namespace(value)
    return acc
  }, {})

  const mergedNamespaces = { ...ns, ...namespaces }

  const resolvePrefixedTerm = (str, namespaces) => {
    if (typeof str !== 'string') return undefined;
    const colonIndex = str.indexOf(':');
    if (colonIndex === -1) return undefined;

    const vocabulary = str.slice(0, colonIndex);
    const property = str.slice(colonIndex + 1);

    if (namespaces[vocabulary]) {
      return namespaces[vocabulary][property];
    }
    return undefined;
  };

  const resolve = (value) => {
    // First, check custom mappings
    if (customMappings && customMappings[value]) {
      const mappedPredicateString = customMappings[value]; // e.g., "rdf:type"
      const resolvedMappedPredicate = resolvePrefixedTerm(mappedPredicateString, mergedNamespaces);
      if (resolvedMappedPredicate) {
        return resolvedMappedPredicate; // Return RDF term (e.g., rdf.type)
      }
      // If custom mapping is not a prefixed term, or prefixed term not found in mergedNamespaces,
      // assume it's a direct URI string and convert to NamedNode
      return rdf.namedNode(mappedPredicateString); // e.g., rdf.namedNode("rdf:type")
    }

    // Then, try to resolve the original value as a prefixed term
    const resolvedOriginalValue = resolvePrefixedTerm(value, mergedNamespaces);
    if (resolvedOriginalValue) {
      return resolvedOriginalValue; // Return RDF term (e.g., ex:Rabbit)
    }

    // If no resolution, return the original value (string)
    return value;
  };

  return ({ subject, predicate, object }) => ({
    resolvedSubject: resolve(subject),
    resolvedPredicate: resolve(predicate),
    resolvedObject: resolve(object)
  });
}

export { getMapper }
