import ns from '../namespaces.js'
import { isString } from '../strings/string.js'

const wellKnown = {
  'is a': ns.rdf.type,
  'same as': ns.rdf.sameAs,
}

function inspectNamespaces (ns, str) {
  if (str && isString(str)) {
    // Predicate is of the form schema:name
    if (ns && str.split(':').length === 2) {
      const [vocabulary, property] = str.split(':')
      return ns[vocabulary] ? ns[vocabulary][property] : undefined
    }
    return wellKnown[str]
  }
}

function inspectCustomMappings (customMappings, str) {
  return customMappings ? customMappings[str] : undefined
}

function getMapper (options) {

  const { namespaces, customMappings } = options
  const resolve = (str) => inspectCustomMappings(customMappings, str) ??
    inspectNamespaces(namespaces, str)
  return ({ subject, predicate, object }, context) => {
    return {
      resolvedSubject: resolve(subject),
      resolvedPredicate: resolve(predicate),
      resolvedObject: resolve(object),
    }
  }
}

export { getMapper }
