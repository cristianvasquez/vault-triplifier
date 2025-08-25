import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'

/**
 * Parse a string value with type inference for booleans, numbers, dates, and strings.
 * Values wrapped in backticks are treated as explicit strings (opt-out mechanism).
 * @param {string} str - The string to parse
 * @returns {boolean|number|Date|string} The parsed value
 */
function parseValue(str) {
  if (typeof str !== 'string') {
    return str;
  }

  const trimmed = str.trim();

  // Handle empty strings
  if (trimmed === '') return trimmed;

  // Handle backtick opt-out - treat as explicit string
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return trimmed.slice(1, -1); // Remove backticks and return as string
  }

  // Boolean parsing
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Number parsing (int or float)
  const num = Number(trimmed);
  if (!isNaN(num) && isFinite(num)) return num;

  // Date parsing - try common ISO date formats and other standard formats
  if (isValidDateString(trimmed)) {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback: return as string
  return trimmed;
}

/**
 * Check if a string looks like a valid date format
 * @param {string} str - The string to check
 * @returns {boolean} True if it looks like a date
 */
function isValidDateString(str) {
  // Common date patterns to recognize
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO datetime
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$/, // ISO with timezone
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
  ];

  return datePatterns.some(pattern => pattern.test(str));
}

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

// Literal factory with type inference
function newLiteral (text) {
  const parsedValue = parseValue(text)
  
  // If it's still a string after parsing, create a plain literal
  if (typeof parsedValue === 'string') {
    return rdf.literal(parsedValue)
  }
  
  // For typed values (boolean, number, date), use rdf-literal's toRdf
  return toRdf(parsedValue)
}

// Web-compatible implementations of pathToFileURL and fileURLToPath
// Convert file path to file:// URL
function pathToFileURL (filepath) {
  if (!filepath.startsWith('/') && !filepath.match(/^[A-Za-z]:/)) {
    filepath = '/' + filepath
  }
  
  // Check for Windows drive letter BEFORE encoding
  const isWindowsPath = filepath.match(/^\/[A-Za-z]:/)
  
  if (isWindowsPath) {
    // Handle Windows paths: preserve drive letter colon, encode the rest
    const [, drive, ...pathParts] = filepath.split('/')
    const encodedParts = pathParts.map(segment => 
      encodeURIComponent(segment).replace(/%2F/g, '/')
    )
    const encodedPath = [drive, ...encodedParts].join('/')
    return rdf.namedNode('file:///' + encodedPath)
  } else {
    // Handle Unix paths: encode all segments
    const encodedPath = filepath.split('/').
      map(segment => encodeURIComponent(segment).replace(/%2F/g, '/')).
      join('/')
    return rdf.namedNode('file://' + encodedPath)
  }
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
  parseValue,
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  appendSelector,
  pathToFileURL,
  fileURLToPath,
}
