import rdf from 'rdf-ext'

function toUri (txt, baseNamespace) {
  return baseNamespace[`${encodeURI(txt)}`]
}

function fromUri (term, baseNamespace) {
  const base = baseNamespace().value
  const inNamespace = term.value.startsWith(base)
  if (!inNamespace) {
    return undefined
  }
  const withoutBase = term.value.replace(new RegExp(`^${base}`), '')
  return decodeURI(withoutBase)
}

// Note
const resourceNamespace = rdf.namespace('urn:resource:')

function pathToUri (txt, options) {
  if (options) throw Error('You shall not pass')
  return toUri(txt, resourceNamespace)
}

function pathFromUri (term, options) {
  if (options) throw Error('You shall not pass')
  return fromUri(term, resourceNamespace)
}

const propertyNamespace = rdf.namespace('urn:property:')

// Properties
// "has name" -> http://some-vault/property/has-name
function propertyToUri (txt, options) {
  if (options) throw Error('You shall not pass')
  return toUri(txt, propertyNamespace)
}

function propertyFromUri (term, options) {
  if (options) throw Error('You shall not pass')
  return fromUri(term, propertyNamespace)
}

const nameNamespace = rdf.namespace('urn:name:')
//Names, symbols that denote notes. [[Alice]]
// "Alice" -> http://some-vault/placeholder/alice
function nameToUri (txt, options) {
  if (options) throw Error('You shall not pass')
  return toUri(txt, nameNamespace)
}

function nameFromUri (term, options) {
  if (options) throw Error('You shall not pass')
  return fromUri(term, nameNamespace)
}

// Literal factory
function newLiteral (txt, options) {
  if (options) throw Error('You shall not pass')
  return rdf.literal(txt)
}

// http://example.com/ + ^blockId -> http://example.com/blockId
const blockUri = (uri, blockId) => rdf.namedNode(
  `${uri.value}/${blockId.replace(/^\^/, '')}`)

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
