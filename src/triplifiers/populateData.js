import rdf from '../rdf-ext.js'
import { isValidUrl } from '../strings/uris.js'
import { reservedProperties } from './specialData.js'

function maybeLink (str, { knownLinks, pointer }, options) {

  // @TODO this should return a context, a label with the link to be displayed in the UIs
  const candidateLink = knownLinks.find(link => str.includes(link.value))
  if (candidateLink) {

    const { label, uri, wikipath } = candidateLink
    // Added as postprocess
    // if (options.includeWikipaths && wikipath) {
    //   pointer.node(uri).addOut(ns.dot.wikipath, rdf.literal(wikipath))
    // }

    candidateLink.mapped = true
    return uri
  }
}

function createPredicate (str, { pointer, termMapper, knownLinks }, options) {
  return termMapper.maybeMapped(str) ??
    maybeLink(str, { pointer, knownLinks }, options) ??
    termMapper.newProperty(str, options)
}

function createObject (str, { pointer, termMapper, knownLinks }, options) {
  return termMapper.maybeMapped(str) ??
    maybeLink(str, { pointer, knownLinks }, options) ??
    termMapper.newLiteral(str, options)
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
    populate(pointer.term, p, o)
  } else if (data.length > 2) {
    const [s, p, o] = data
    populate(createPredicate(s, context, options), p, o)
  }

  function populate (sTerm, p, o) {
    const pTerm = createPredicate(p, context, options)
    const oTerm = createObject(o, context, options)
    pointer.node(sTerm).addOut(pTerm, oTerm)
  }

}

const literalLike = (value) => typeof value === 'string' || typeof value ===
  'boolean' || typeof value === 'number'


function populateYamlLike (data, context, options) {
  const { pointer, termMapper, knownLinks } = context

  for (const [key, value] of Object.entries(data)) {

    if (!reservedProperties.has(key)) {
      const predicate = createPredicate(key, context, options)

      if (literalLike(value)) {
        const object = isValidUrl(`${value}`)
          ? rdf.namedNode(`${value}`)
          : createObject(`${value}`, context, options)
        pointer.addOut(predicate, object)
      } else if (Array.isArray(value) && value.length) {

        value.forEach(x => {
          if (literalLike(x)) {
            const literal = createObject(x, context, options)
            pointer.addOut(predicate, literal)
          } else {
            const uri = rdf.blankNode()
            pointer.addOut(predicate, uri)
            populateYamlLike(value,
              { pointer: pointer.node(uri), termMapper, knownLinks }, options)
          }
        })
      } else if (typeof value === 'object' && value !== null && value !==
        undefined) {
        const uri = rdf.blankNode()
        pointer.addOut(predicate, uri)
        populateYamlLike(value,
          { pointer: pointer.node(uri), termMapper, knownLinks }, options)
      }
    }
  }

}

export { populateYamlLike, populateInline }
