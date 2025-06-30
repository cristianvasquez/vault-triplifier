import rdf from 'rdf-ext'

function pathToUri (txt, options) {
  return toUri(txt, options, 'note/')
}

function pathFromUri (term, options) {
  return fromUri(term, options, 'note/')
}

// "has name" -> http://some-vault/property/has-name
function propertyToUri (txt, options) {
  return toUri(txt, options, 'property/')
}

function propertyFromUri (term, options) {
  return fromUri(term, options, 'property/')
}

// "Alice" -> http://some-vault/placeholder/alice
function nameToUri (txt, options) {
  return toUri(txt, options, 'placeholder/')
}

function nameFromUri (term, options) {
  return fromUri(term, options, 'placeholder/')
}

function newLiteral (txt, options) {
  return rdf.literal(txt)
}

// http://example.com/ + ^blockId -> http://example.com/blockId
const blockUri = (uri, blockId) => rdf.namedNode(
  `${uri.value}/${blockId.replace(/^\^/, '')}`)

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
  pathToUri,
  pathFromUri,
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  blockUri,
}
