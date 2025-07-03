import rdf from 'rdf-ext'

// Base conversion functions
function toUri(text, namespace) {
  return namespace[encodeURI(text)]
}

function fromUri(term, namespace) {
  const base = namespace().value
  if (!term.value.startsWith(base)) {
    return null
  }

  const suffix = term.value.slice(base.length)
  return decodeURI(suffix)
}

// Namespaces
const namespaces = {
  resource: rdf.namespace('urn:resource:'),
  property: rdf.namespace('urn:property:'),
  name: rdf.namespace('urn:name:')
}

// Resource/Path functions
function pathToUri(path) {
  return toUri(path, namespaces.resource)
}

function pathFromUri(term) {
  return fromUri(term, namespaces.resource)
}

// Property functions
function propertyToUri(property) {
  return toUri(property, namespaces.property)
}

function propertyFromUri(term) {
  return fromUri(term, namespaces.property)
}

// Name functions
function nameToUri(name) {
  return toUri(name, namespaces.name)
}

function nameFromUri(term) {
  return fromUri(term, namespaces.name)
}

// Literal factory
function newLiteral(text) {
  return rdf.literal(text)
}

// Block URI builder
function blockUri(baseUri, blockId) {
  const cleanId = blockId.replace(/^\^/, '')
  return rdf.namedNode(`${baseUri.value}/${cleanId}`)
}

export {
  pathToUri,
  pathFromUri,
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  blockUri
}
