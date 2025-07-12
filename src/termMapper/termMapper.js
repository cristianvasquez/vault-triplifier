import rdf from 'rdf-ext'

// Base conversion functions
function toUri (text, namespace) {
  return namespace[encodeURI(text)]
}

function fromUri (term, namespace) {
  const base = namespace().value
  if (!term.value.startsWith(base)) {
    return null
  }

  const suffix = term.value.slice(base.length)
  return decodeURI(suffix)
}

// Namespaces
const namespaces = {
  property: rdf.namespace('urn:property:'),
  name: rdf.namespace('urn:name:'),
}

// Property functions
// "has name" -> http://some-vault/property/has-name
function propertyToUri (property) {
  return toUri(property, namespaces.property)
}

function propertyFromUri (term) {
  return fromUri(term, namespaces.property)
}

//Names, symbols that denote notes. [[Alice]]
// "Alice" -> http://some-vault/placeholder/alice
function nameToUri (name) {
  return toUri(name, namespaces.name)
}

function nameFromUri (term) {
  return fromUri(term, namespaces.name)
}

// Block URI builder. Known Obsidian selectors are of the form # for headers, #^ for identifiers
function appendSelector (nameTerm, selector) {
  return rdf.namedNode(`${nameTerm.value}${encodeURI(selector)}`)
}

// Literal factory
function newLiteral (text) {
  return rdf.literal(text)
}

// Web-compatible implementations of pathToFileURL and fileURLToPath
// Convert file path to file:// URL
function pathToFileURL (filepath) {
  if (!filepath.startsWith('/') && !filepath.match(/^[A-Za-z]:/)) {
    filepath = '/' + filepath
  }
  const encodedPath = filepath.split('/').
    map(segment => encodeURIComponent(segment).replace(/%2F/g, '/')).
    join('/')
  return encodedPath.match(/^\/[A-Za-z]:/)
    ? 'file:///' + encodedPath.slice(1)
    : rdf.namedNode('file://' + encodedPath)
}

// Convert file:// URL to file path
function fileURLToPath (term) {
  const fileUrl = term.value
  if (!fileUrl.startsWith('file://')) {
    throw new Error('URL must use file: protocol')
  }
  let path = fileUrl.slice(7)
  if (path.startsWith('/') && path[2] === ':') {
    path = path.slice(1)
  }
  return path.split('/').map(decodeURIComponent).join('/')
}

export {
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  appendSelector,
  pathToFileURL,
  fileURLToPath,
}
