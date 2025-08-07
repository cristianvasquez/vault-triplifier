import rdf from 'rdf-ext'
import { createMapper } from '../termMapper/customMapper.js'
import { newLiteral, propertyToUri, nameToUri } from '../termMapper/termMapper.js'
import { toTerm } from '../utils/uris.js'

// ============================================================================
// Constants
// ============================================================================

const RESERVED_PROPERTIES = new Set(['uri'])

const TERM_TYPES = {
  SUBJECT: 'subject',
  PREDICATE: 'predicate',
  OBJECT: 'object'
}

// ============================================================================
// Type Guards & Utilities
// ============================================================================

/**
 * Check if value is a string
 * @param {*} value - Value to check
 * @returns {boolean}
 */
const isString = (value) =>
  typeof value === 'string' || value instanceof String

/**
 * Check if value is an RDF term
 * @param {*} value - Value to check
 * @returns {boolean}
 */
const isRdfTerm = (value) =>
  value?.termType !== undefined

/**
 * Check if value can be converted to a literal
 * @param {*} value - Value to check
 * @returns {boolean}
 */
const isLiteralizable = (value) => {
  const type = typeof value
  return type === 'string' || type === 'boolean' || type === 'number'
}

/**
 * Convert value to literal string if possible
 * @param {*} value - Value to convert
 * @returns {string|null}
 */
const asLiteral = (value) =>
  isLiteralizable(value) ? String(value) : null

// ============================================================================
// Term Resolution
// ============================================================================

/**
 * Resolve a value to an RDF term based on its position in the triple
 * @param {*} value - Value to resolve
 * @param {string} termType - Type of term (subject, predicate, object)
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Object} RDF term
 */
function resolveToRdfTerm(value, termType, context, options) {
  // Already an RDF term
  if (isRdfTerm(value)) {
    return value
  }

  // Try custom mapper
  const mappedTerm = tryCustomMapper(value, termType, options)
  if (mappedTerm) {
    return mappedTerm
  }

  // Try known links
  const knownLinkTerm = tryKnownLinks(value, context)
  if (knownLinkTerm) {
    return knownLinkTerm
  }

  // Try URI detection
  const uriTerm = toTerm(value)
  if (uriTerm) {
    return uriTerm
  }

  // Apply position-specific fallbacks
  return applyTermTypeFallback(value, termType)
}

/**
 * Try to map value using custom mapper
 * @private
 */
function tryCustomMapper(value, termType, options) {
  const mapper = createMapper(options)
  const mapped = mapper({
    [termType]: value
  })

  const resolvedKey = `resolved${capitalize(termType)}`
  return mapped[resolvedKey] || null
}

/**
 * Try to resolve value using known links
 * @private
 */
function tryKnownLinks(value, context) {
  if (!isString(value) || !context.knownLinks) {
    return null
  }

  const knownLink = context.knownLinks.find(link =>
    value.includes(link.value)
  )

  if (knownLink) {
    knownLink.mapped = true
    return knownLink.uri
  }

  return null
}

/**
 * Apply position-specific fallback conversion
 * @private
 */
function applyTermTypeFallback(value, termType) {
  switch (termType) {
    case TERM_TYPES.OBJECT:
      return newLiteral(value)
    case TERM_TYPES.PREDICATE:
      return propertyToUri(value)
    case TERM_TYPES.SUBJECT:
      return nameToUri(value)
    default:
      throw new Error(`Unknown term type: ${termType}`)
  }
}

/**
 * Capitalize first letter of string
 * @private
 */
const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

// ============================================================================
// Triple Processing
// ============================================================================

/**
 * Process a complete triple with unified logic
 * @param {*} subject - Subject of the triple
 * @param {*} predicate - Predicate of the triple
 * @param {*} object - Object of the triple
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Object} Processed triple components
 */
function processTriple(subject, predicate, object, context, options) {
  return {
    subject: subject
      ? resolveToRdfTerm(subject, TERM_TYPES.SUBJECT, context, options)
      : null,
    predicate: resolveToRdfTerm(predicate, TERM_TYPES.PREDICATE, context, options),
    object: resolveToRdfTerm(object, TERM_TYPES.OBJECT, context, options)
  }
}

/**
 * Add a triple to the graph with proper resolution
 * @param {Object} pointer - Graph pointer
 * @param {Object} triple - Triple components
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @throws {Error} If object is invalid
 */
function addTriple(pointer, { subject, predicate, object }, context, options) {
  // Validate inputs
  if (!(isString(object) || isRdfTerm(object))) {
    throw new Error(`Invalid object: ${JSON.stringify(object, null, 2)}`)
  }

  // Process all terms with unified logic
  const processed = processTriple(subject, predicate, object, context, options)

  // Handle subject (special case for pointer.term)
  const finalSubject = subject === pointer.term
    ? subject
    : processed.subject

  pointer.node(finalSubject).addOut(processed.predicate, processed.object)
}

// ============================================================================
// Data Population Functions
// ============================================================================

/**
 * Process inline array data
 * [p, o] -> current-p-o
 * [s, p, o] -> s-p-o
 * @param {Array} data - Array data to process
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 */
function populateInline(data, context, options) {
  if (data.length < 2) {
    // Silently ignore arrays with insufficient elements
    return
  }

  const { pointer } = context

  if (data.length === 2) {
    processTwoElementArray(data, pointer, context, options)
  } else {
    processThreeElementArray(data, pointer, context, options)
  }
}

/**
 * Process two-element array [predicate, object]
 * @private
 */
function processTwoElementArray([predicate, objectValue], pointer, context, options) {
  if (RESERVED_PROPERTIES.has(predicate)) {
    return
  }

  // Check for internal links
  const internalLinks = findRelevantInternalLinks(objectValue, context.knownLinks)

  if (internalLinks.length > 0) {
    // Create a triple for each linked entity
    for (const link of internalLinks) {
      addTriple(pointer, {
        subject: pointer.term,
        predicate,
        object: link.value
      }, context, options)
    }
    return
  }

  // Fallback to original behavior
  addTriple(pointer, {
    subject: pointer.term,
    predicate,
    object: objectValue
  }, context, options)
}

/**
 * Process three-element array [subject, predicate, object]
 * @private
 */
function processThreeElementArray([subject, predicate, object], pointer, context, options) {
  if (RESERVED_PROPERTIES.has(predicate)) {
    return
  }

  addTriple(pointer, {
    subject,
    predicate,
    object
  }, context, options)
}

/**
 * Find relevant internal links in a value
 * @private
 */
function findRelevantInternalLinks(value, knownLinks) {
  if (!knownLinks) {
    return []
  }

  return knownLinks.filter(link =>
    link.type === 'internal' && value.includes(link.value)
  )
}

/**
 * Process YAML-like object data
 * @param {Object} data - Object data to process
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 */
function populateYamlLike(data, context, options) {
  const { pointer } = context

  for (const [predicate, value] of Object.entries(data)) {
    if (RESERVED_PROPERTIES.has(predicate)) {
      continue
    }
    processValue(pointer, predicate, value, context, options)
  }
}

/**
 * Process a single value based on its type
 * @param {Object} pointer - Graph pointer
 * @param {string} predicate - Predicate for the value
 * @param {*} value - Value to process
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 */
function processValue(pointer, predicate, value, context, options) {
  // Handle primitives
  const literal = asLiteral(value)
  if (literal !== null) {
    addTriple(pointer, {
      subject: pointer.term,
      predicate,
      object: literal
    }, context, options)
    return
  }

  // Handle arrays
  if (Array.isArray(value)) {
    for (const item of value) {
      processValue(pointer, predicate, item, context, options)
    }
    return
  }

  // Handle objects
  if (value && typeof value === 'object') {
    const childNode = rdf.blankNode()

    addTriple(pointer, {
      subject: pointer.term,
      predicate,
      object: childNode
    }, context, options)

    // Recursively process the nested object
    populateYamlLike(value, {
      ...context,
      pointer: pointer.node(childNode)
    }, options)
  }
}

// ============================================================================
// Exports
// ============================================================================

export {
  populateYamlLike,
  populateInline
}
