import rdf from 'rdf-ext'
import ns from '../namespaces.js'

function populateData (data, { pointer, termMapper }, options) {

  if (!termMapper) {
    throw Error('requires termMapper')
  }

  for (const [key, value] of Object.entries(data)) {

    const candidate = termMapper.toNamed(key, options)
    const predicate = candidate.termType === 'BlankNode'
      ? ns.dot.undefined
      : candidate

    if (typeof value === 'string' || typeof value === 'boolean' ||
      typeof value === 'number') {
      pointer.addOut(predicate, termMapper.toTerm(value, options))
    } else if (typeof value === 'object') {
      const uri = rdf.blankNode()
      pointer.addOut(predicate, uri)
      populateData(value, { pointer: pointer.node(uri), termMapper }, options)
    }
  }
}

export { populateData }
