import rdf from '../rdf-ext.js'
import { isString } from '../strings/string.js'
import { isHTTP } from '../strings/uris.js'
import { reservedProperties } from './specialData.js'

function maybeKnown (str, { knownLinks, termMapper }, options) {

  // This code smells
  // @TODO this should return a context, a label with the link to be displayed in the UIs
  const knownLink = knownLinks.find(link => str.includes(link.value))
  if (knownLink) {
    const { label, uri, wikipath, linktext } = knownLink

    // console.log('knownLink',knownLink, uri, termMapper.getPathByName(wikipath))

    // Added as postprocess
    // if (options.includeWikipaths && wikipath) {
    //   pointer.node(uri).addOut(ns.dot.wikipath, rdf.literal(wikipath))
    // }
    knownLink.mapped = true
    return uri
  }

  if (isHTTP(str)) {
    return rdf.namedNode(str)
  }

}

function onlyIfTerm (term) {
  return term.termType ? term : undefined

}

function addTriple (
  pointer, { subject, predicate, object },
  context,
  options) {
  const { termMapper, knownLinks } = context

  if (!(isString(object) || object.termType)) {
    throw Error(JSON.stringify(object, null, 2))
  }

  const {
    resolvedSubject,
    resolvedPredicate,
    resolvedObject,
  } = termMapper.maybeMapped({ subject, predicate, object }, context)

  // subject
  const s = resolvedSubject ?? onlyIfTerm(subject) ??
    maybeKnown(subject, { termMapper, knownLinks }, options) ??
    termMapper.newProperty(subject, options)

  // predicate
  const p = resolvedPredicate ?? onlyIfTerm(predicate) ??
    maybeKnown(predicate, { termMapper, knownLinks }, options) ??
    termMapper.newProperty(predicate, options)

  // object
  const o = resolvedObject ?? onlyIfTerm(object) ??
    maybeKnown(object, { termMapper, knownLinks }, options) ??
    termMapper.newLiteral(object, options)

  pointer.node(s).addOut(p, o)
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
    addTriple(pointer,
      { subject: pointer.term, predicate: p, object: o }, context,
      options)

  } else if (data.length > 2) {
    const [s, p, o] = data
    addTriple(pointer,
      { subject: s, predicate: p, object: o },
      context, options)
  }
}

function asLiteralLike (value) {
  if (typeof value === 'string' || typeof value ===
    'boolean' || typeof value === 'number') {
    return `${value}`
  }
}

function populateYamlLike (data, context, options) {
  const { pointer, termMapper, knownLinks } = context

  for (const [predicate, value] of Object.entries(data)) {

    const object = asLiteralLike(value)
    if (!reservedProperties.has(predicate)) {
      if (object) {

        addTriple(pointer,
          { subject: pointer.term, predicate, object },
          context, options)

      } else if (Array.isArray(value) && value.length) {
        value.forEach(x => {

          const object = asLiteralLike(x)
          if (object) {

            addTriple(pointer,
              { subject: pointer.term, predicate, object },
              context, options)

          } else {
            const uri = rdf.blankNode()
            addTriple(pointer,
              { subject: pointer.term, predicate, object:uri },
              context, options)
            populateYamlLike(value,
              { pointer: pointer.node(uri), termMapper, knownLinks }, options)
          }
        })
      } else if (typeof value === 'object' && value !== null && value !==
        undefined) {
        const subject = rdf.blankNode()
        addTriple(pointer,
          { subject:pointer.term, predicate, object: subject },
          context, options)
        populateYamlLike(value,
          { pointer: pointer.node(subject), termMapper, knownLinks }, options)
      }
    }
  }

}

export { populateYamlLike, populateInline }
