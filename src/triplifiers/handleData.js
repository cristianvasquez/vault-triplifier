import rdf from 'rdf-ext'

function populatePointer (data, context, options) {

  const { pointer, uriResolver } = context
  if (!uriResolver){
    throw Error('requires uriResolver')
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' || typeof value === 'boolean' ||
      typeof value === 'number') {
      pointer.addOut(uriResolver.toNamed(key), uriResolver.toTerm(value))
    } else if (typeof value === 'object') {
      const uri = rdf.blankNode()
      pointer.addOut(uriResolver.toNamed(key), uri)
      populatePointer(value, { pointer: pointer.node(uri), uriResolver },
        options)
    }
  }
}

export { populatePointer }
