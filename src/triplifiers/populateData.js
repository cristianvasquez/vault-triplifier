import rdf from '../rdf-ext.js'
import ns from '../namespaces.js'

function maybeLink (str, { knownLinks }) {
  const candidateLink = knownLinks.find(link => str.includes(link.value))
  if (candidateLink) {
    candidateLink.mapped = true
    return candidateLink.named
  }
}

function getNamed (str, { pointer, termMapper, knownLinks }, options) {
  return maybeLink(str, { knownLinks }) ?? termMapper.toNamed(str, options)
}

function getTerm (str, { pointer, termMapper, knownLinks }, options) {
  return maybeLink(str, { knownLinks }) ?? termMapper.toTerm(str, options)
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
    populate(getNamed(s, context, options), p, o)
  }

  function populate (sTerm, p, o) {
    const pTerm = getNamed(p, context, options)
    const oTerm = getTerm(o, context, options)
    pointer.node(sTerm).addOut(pTerm, oTerm)
    if (addLabels) {
      pointer.node(pTerm).addOut(ns.schema.name, p)
    }
  }

}

const literalLike = (value) =>typeof value === 'string' || typeof value === 'boolean' ||
  typeof value === 'number'

function populateYamlLike (data, context, options) {
  const { pointer, termMapper, knownLinks } = context

  for (const [key, value] of Object.entries(data)) {
    const candidate = getNamed(key, context, options)
    // Turtle serialization don't like blank-nodes as predicate, should I care?
    const predicate = candidate.termType === 'BlankNode'
      ? ns.dot.undefined
      : candidate

    if (literalLike(value)) {
      const object = getTerm(`${value}`, context, options)
      pointer.addOut(predicate, object)
    } else if (Array.isArray(value)){
      value.forEach(x => {
        if(literalLike(x)){
          pointer.addOut(predicate, rdf.literal(x))
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
