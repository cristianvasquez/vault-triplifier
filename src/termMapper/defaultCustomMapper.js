import ns from '../namespaces.js'
import { OptionsSchema } from '../schemas.js'

const WELL_KNOWN = {
  'is a': ns.rdf.type,
  'same as': ns.rdf.sameAs,
}

function resolveNamespace(parsedNamespaces, str) {
  if (!str || typeof str !== 'string') return null

  const colonIndex = str.indexOf(':')
  if (colonIndex === -1) return WELL_KNOWN[str]

  const vocabulary = str.slice(0, colonIndex)
  const property = str.slice(colonIndex + 1)

  return parsedNamespaces?.[vocabulary]?.[property]
}

function getMapper(options = {}) {
  const parsedOptions = OptionsSchema.parse(options)
  const { namespaces, customMappings } = parsedOptions

  const resolve = (value) =>
    customMappings?.[value] ?? resolveNamespace(namespaces, value)

  return ({ subject, predicate, object }) => ({
    resolvedSubject: resolve(subject),
    resolvedPredicate: resolve(predicate),
    resolvedObject: resolve(object)
  })
}

export { getMapper }
