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

// Literal factory
function newLiteral (text) {
  return rdf.literal(text)
}

// Block URI builder
// http://example.com/ + ^blockId -> http://example.com/blockId
function blockUri (baseUri, blockId) {
  const cleanId = blockId.replace(/^\^/, '')
  return rdf.namedNode(`${baseUri.value}/${cleanId}`)
}

// Web-compatible implementations of pathToFileURL and fileURLToPath

/**
 * Convert a file path to a file:// URL (web-compatible)
 * @param {string} filepath - The file path to convert
 * @returns {string} The file:// URL
 */
function pathToFileURL (filepath) {
  // Ensure the path starts with a slash for absolute paths
  if (!filepath.startsWith('/') && !filepath.match(/^[A-Za-z]:/)) {
    filepath = '/' + filepath
  }

  // Create a file:// URL with proper encoding
  // Split the path and encode each segment to handle special characters
  const segments = filepath.split('/')
  const encodedSegments = segments.map(segment =>
    encodeURIComponent(segment).replace(/%2F/g, '/'),
  )

  // Join back together and create the file:// URL
  const encodedPath = encodedSegments.join('/')

  // Handle Windows drive letters
  if (encodedPath.match(/^\/[A-Za-z]:/)) {
    return 'file:///' + encodedPath.substring(1)
  }

  return rdf.namedNode('file://' + encodedPath)
}

/**
 * Convert a file:// URL to a file path (web-compatible)
 * @returns {string} The file path
 * @param term
 */
function fileURLToPath (term) {

  const fileUrl = term.value

  if (!fileUrl.startsWith('file://')) {
    throw new Error('URL must use file: protocol')
  }

  // Remove the file:// prefix
  let path = fileUrl.substring(7)

  // Handle Windows file URLs (file:///C:/...)
  if (path.startsWith('/') && path[2] === ':') {
    path = path.substring(1)
  }

  // Decode the path segments
  const segments = path.split('/')
  const decodedSegments = segments.map(segment =>
    decodeURIComponent(segment),
  )

  return decodedSegments.join('/')
}

export {
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  blockUri,
  pathToFileURL,
  fileURLToPath,
}
