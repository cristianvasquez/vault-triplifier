import rdf from 'rdf-ext'

function populatePointer (data, context, options) {

  const { pointer, termMapper } = context
  if (!termMapper) {
    throw Error('requires termMapper')
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' || typeof value === 'boolean' ||
      typeof value === 'number') {
      pointer.addOut(termMapper.toNamed(key, options),
        termMapper.toTerm(value, options))
    } else if (typeof value === 'object') {
      const uri = rdf.blankNode()
      pointer.addOut(termMapper.toNamed(key, options), uri)
      populatePointer(value, { pointer: pointer.node(uri), termMapper },
        options)
    }
  }
}

export { populatePointer }
