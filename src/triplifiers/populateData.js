import rdf from '../rdf-ext.js'
import { isValidUrl } from '../strings/uris.js'
import { reservedProperties } from './specialData.js'

function maybeKnownLink (str, { knownLinks, pointer }, options) {

  // @TODO this should return a context, a label with the link to be displayed in the UIs
  const candidateLink = knownLinks.find(link => str.includes(link.value))
  if (candidateLink) {

    const { label, uri, wikipath, linktext } = candidateLink
    // Added as postprocess
    // if (options.includeWikipaths && wikipath) {
    //   pointer.node(uri).addOut(ns.dot.wikipath, rdf.literal(wikipath))
    // }

    candidateLink.mapped = true
    return uri
  }
}

function createPredicate (str, context, options) {
  const { pointer, termMapper, knownLinks } = context
  return termMapper.maybeMapped(str, context) ??
    maybeKnownLink(str, { pointer, knownLinks }, options) ??
    (isValidUrl(str) ? rdf.namedNode(str) : termMapper.newProperty(str,
      options))
}

function createObject (str, context, options) {
  const { pointer, termMapper, knownLinks } = context
  return termMapper.maybeMapped(str, context) ??
    maybeKnownLink(str, { pointer, knownLinks }, options) ??
    (isValidUrl(str) ? rdf.namedNode(str) : termMapper.newLiteral(str, options))
}

function triple (uri, predicateStr, objectStr, context, options) {
  const predicate = createPredicate(predicateStr, context, options)
  const object = createObject(objectStr, context, options)
  return { subject: uri, predicate, object }
}

/**
 * If array contains 2 elements P and O, add the triple Current-P-O
 *
 * If array contains 3 elements S, P and O, add the triple S-P-O
 *
 * If there are more elements, the semantics are not specified (yet). The tailing elements are ignored
 */
function populateInline (data, context, options) {
  const { pointer } = context
  if (data.length === 2) {
    const [p, o] = data
    addTriple(pointer, triple(pointer.term, p, o, context, options))
  } else if (data.length > 2) {
    const [s, p, o] = data
    const uri = createPredicate(s, context, options)
    addTriple(pointer, triple(uri, p, o, context, options))
  }
}

function addTriple (pointer, triple) {
  const { subject, predicate, object } = triple
  pointer.node(subject).addOut(predicate, object)
}

const literalLike = (value) => typeof value === 'string' || typeof value ===
  'boolean' || typeof value === 'number'

function populateYamlLike (data, context, options) {
  const { pointer, termMapper, knownLinks } = context

  for (const [key, value] of Object.entries(data)) {

    if (!reservedProperties.has(key)) {

      if (literalLike(value)) {
        addTriple(pointer,
          triple(pointer.term, key, `${value}`, context, options))
      } else if (Array.isArray(value) && value.length) {
        value.forEach(x => {
          if (literalLike(x)) {
            addTriple(pointer,
              triple(pointer.term, key, `${x}`, context, options))
          } else {
            const uri = rdf.blankNode()
            const predicate = createPredicate(key, context, options)
            pointer.addOut(predicate, uri)
            populateYamlLike(value,
              { pointer: pointer.node(uri), termMapper, knownLinks }, options)
          }
        })
      } else if (typeof value === 'object' && value !== null && value !==
        undefined) {
        const uri = rdf.blankNode()
        const predicate = createPredicate(key, context, options)
        pointer.addOut(predicate, uri)
        populateYamlLike(value,
          { pointer: pointer.node(uri), termMapper, knownLinks }, options)
      }
    }
  }

}

export { populateYamlLike, populateInline }
