import rdf from '../rdf-ext.js'

function createTermMapper ({
  customMapper, getPathByName,
}) {

  const maybeMapped = (pattern, context) => customMapper ? customMapper(pattern,
    context) : noMapper(pattern, context)

  function pathToUri (txt, options) {
    return toUri(txt, options, 'note/')
  }

  function pathFromUri (term, options) {
    return fromUri(term, options, 'note/')
  }

  // To build properties
  // For example, "has name" -> http://some-vault/has-name
  function propertyToUri (txt, options) {
    return toUri(txt, options, 'property/')
  }

  function propertyFromUri (term, options) {
    return fromUri(term, options, 'property/')
  }

  function newLiteral (txt, options) {
    return rdf.literal(txt)
  }

  // http://example.com/ + ^blockId -> http://example.com/blockId
  const blockUri = (uri, blockId) => rdf.namedNode(
    `${uri.value}/${blockId.replace(/^\^/, '')}`)

  return {
    pathToUri, pathFromUri, propertyToUri, propertyFromUri,

    newLiteral, maybeMapped, blockUri, getPathByName,
  }

}

const noMapper = (pattern, context) => ({
  resolvedSubject: undefined,
  resolvedPredicate: undefined,
  resolvedObject: undefined,
})

function toUri (txt, options, prefix) {
  const { baseNamespace } = options
  return baseNamespace[`${prefix}${encodeURI(txt)}`]
}

function fromUri (term, options, prefix) {
  const { baseNamespace } = options
  const base = `${baseNamespace().value}${prefix}`
  const inNamespace = term.value.startsWith(base)
  if (!inNamespace) {
    return undefined
  }
  const withoutBase = term.value.replace(new RegExp(`^${base}`), '')
  return decodeURI(withoutBase)
}

export {
  createTermMapper,
}
