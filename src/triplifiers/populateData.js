import rdf from '../rdf-ext.js'
import ns from '../namespaces.js'

function maybeLink (str, { knownLinks, pointer }, options) {
  // @TODO this should return a context, a label with the link to be displayed in the UIs

  const candidateLink = knownLinks.find(link => str.includes(link.value))
  if (candidateLink) {

    const {label,uri,wikiPath} = candidateLink

    if (options.addLabels && label) {
      pointer.node(uri).addOut(ns.schema.name, rdf.literal(label))
    }
    if (options.includeWikiPaths && wikiPath) {
      pointer.node(uri).addOut(ns.dot.wikiPath, rdf.literal(wikiPath))
    }

    candidateLink.mapped = true
    return uri
  }
}


function createProperty (str, { pointer, termMapper, knownLinks }, options) {
  return maybeLink(str, { pointer, knownLinks }, options) ??
    termMapper.newProperty(str, options)
}

function createLiteral (str, { pointer, termMapper, knownLinks }, options) {
  return maybeLink(str, { pointer, knownLinks }, options) ??
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
  const { addLabels } = options

  if (data.length === 2) {
    const [p, o] = data
    populate(pointer.term, p, o)
  } else if (data.length > 2) {
    const [s, p, o] = data
    populate(createProperty(s, context, options), p, o)
  }

  function populate (sTerm, p, o) {
    const pTerm = createProperty(p, context, options)
    const oTerm = createLiteral(o, context, options)
    pointer.node(sTerm).addOut(pTerm, oTerm)
    if (addLabels) {
      pointer.node(pTerm).addOut(ns.schema.name, p)
    }
  }

}

const literalLike = (value) => typeof value === 'string' || typeof value ===
  'boolean' || typeof value === 'number'

function populateYamlLike (data, context, options) {
  const { pointer, termMapper, knownLinks } = context

  for (const [key, value] of Object.entries(data)) {
    const predicate = createProperty(key, context, options)

    if (literalLike(value)) {
      const object = createLiteral(`${value}`, context, options)
      pointer.addOut(predicate, object)
    } else if (Array.isArray(value)) {
      value.forEach(x => {
        if (literalLike(x)) {
          const object = createLiteral(x, context, options)
          pointer.addOut(predicate, object)
        } else {
          const uri = rdf.blankNode()
          pointer.addOut(predicate, uri)
          populateYamlLike(value,
            { pointer: pointer.node(uri), termMapper, knownLinks }, options)
        }
      })
    } else if (typeof value === 'object') {
      const uri = rdf.blankNode()
      pointer.addOut(predicate, uri)
      populateYamlLike(value,
        { pointer: pointer.node(uri), termMapper, knownLinks }, options)
    }
  }

}

export { populateYamlLike, populateInline }
