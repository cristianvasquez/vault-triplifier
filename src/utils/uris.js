import rdf from 'rdf-ext'

// /foo/bar/name.md -> name
// /foo/bar/name -> name
// /foo/bar/img.png -> img.png
function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}
/**
 * Converts values to appropriate RDF terms
 * Extracts URI from angle brackets and converts to NamedNode or Literal
 * @param {string} value - The value to process
 * @returns {NamedNode|Literal} - RDF term (NamedNode for URIs, Literal for everything else)
 */
function toTerm(value) {
  if (typeof value === 'string') {
    // Handle delimited URIs (wrapped in angle brackets) - extract and convert to NamedNode
    if (isDelimitedURI(value)) {
      const extractedURI = extractDelimitedURI(value)
      return rdf.namedNode(extractedURI)
    }

    // Handle HTTP(S) URIs - convert to NamedNode
    if (isHTTP(value)) {
      return rdf.namedNode(value)
    }

    // Handle URN schemes - convert to NamedNode
    if (isURN(value)) {
      return rdf.namedNode(value)
    }

    // Handle file URIs - convert to NamedNode
    if (isFile(value)) {
      return rdf.namedNode(value)
    }
  }

  // Not a recognized URI pattern
  return null
}

function isHTTP(urlString) {
  try {
    if (!(urlString.startsWith('http'))) {
      return false
    }
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}

function isURN(value) {
  if (typeof value !== 'string') {
    return false
  }
  // URN format: urn:namespace:specific-string
  return /^urn:[a-zA-Z0-9][a-zA-Z0-9-]{0,31}:/.test(value)
}

/**
 * Check if a value is a file URI
 * @param {*} value
 * @returns {boolean}
 */
function isFile(value) {
  if (typeof value !== 'string') {
    return false
  }
  try {
    // Check if it starts with file: and is a valid URL
    return value.startsWith('file:') && Boolean(new URL(value))
  } catch (e) {
    return false
  }
}

function isDelimitedURI(value) {
  if (typeof value !== 'string') {
    return false
  }

  // Check if value is wrapped in angle brackets
  if (value.startsWith('<') && value.endsWith('>')) {
    const uri = value.slice(1, -1) // Remove < and >

    // Basic URI validation - should contain a scheme
    try {
      new URL(uri)
      return true
    } catch (e) {
      // If URL constructor fails, check for other URI schemes
      return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(uri)
    }
  }

  return false
}

function extractDelimitedURI(value) {
  if (isDelimitedURI(value)) {
    return value.slice(1, -1) // Remove < and >
  }
  return null
}

export {
  getNameFromPath,
  toTerm,
}
