import rdf from 'rdf-ext'
import { createMapper } from '../termMapper/customMapper.js'
import { newLiteral, propertyToUri } from '../termMapper/termMapper.js'
import { isHTTP } from '../utils/uris.js'

// Properties that should not be converted to RDF triples
const reservedProperties = new Set()

/**
 * Resolve a term through various strategies
 */
function resolveTerm (value, termType, context, options) {
  // Already an RDF term
  if (value?.termType) {
    return value
  }

  // Apply custom mapper
  const mapper = createMapper(options)
  const mapped = mapper({
    subject: termType === 'subject' ? value : undefined,
    predicate: termType === 'predicate' ? value : undefined,
    object: termType === 'object' ? value : undefined,
  })

  const resolvedKey = `resolved${termType.charAt(0).toUpperCase() +
  termType.slice(1)}`
  if (mapped[resolvedKey]) {
    return mapped[resolvedKey]
  }

  // Check known links
  if (isString(value) && context.knownLinks) {
    const knownLink = context.knownLinks.find(
      link => value.includes(link.value))
    if (knownLink) {
      knownLink.mapped = true
      return knownLink.uri
    }
  }

  // Handle HTTP URIs
  if (isString(value) && isHTTP(value)) {
    return rdf.namedNode(value)
  }

  // Apply default transformation based on term type
  if (termType === 'object') {
    return newLiteral(value)
  } else {
    return propertyToUri(value)
  }
}

/**
 * Add a triple to the graph with proper resolution
 */
function addTriple (pointer, { subject, predicate, object }, context, options) {
  // Validate inputs
  if (!(isString(object) || object?.termType)) {
    throw new Error(`Invalid object: ${JSON.stringify(object, null, 2)}`)
  }

  // Resolve all terms
  const s = subject === pointer.term
    ? subject
    : resolveTerm(subject, 'subject', context, options)

  const p = resolveTerm(predicate, 'predicate', context, options)
  const o = resolveTerm(object, 'object', context, options)

  pointer.node(s).addOut(p, o)
}

/**
 * Process inline array data
 * [p, o] -> current-p-o
 * [s, p, o] -> s-p-o
 */
function populateInline (data, context, options) {
  const { pointer, knownLinks } = context

  if (data.length === 2) {
    const [predicate, objectValue] = data

    // Check if we have internal links that should be used as separate relationship targets
    if (knownLinks) {
      // Filter links to only those that actually appear in this specific objectValue
      const relevantLinks = knownLinks.filter(link => 
        link.type === 'internal' && objectValue.includes(link.value)
      )
      
      if (relevantLinks.length > 0) {
        // Create a triple for each linked entity that appears in this line
        for (const link of relevantLinks) {
          addTriple(pointer, {
            subject: pointer.term,
            predicate,
            object: link.value, // This will be resolved to a URI by addTriple
          }, context, options)
        }
        return // Don't create the original triple with the raw string
      }
    }

    // Fallback to original behavior if no relevant links found
    addTriple(pointer, {
      subject: pointer.term,
      predicate,
      object: objectValue,
    }, context, options)
  } else if (data.length >= 3) {
    const [subject, predicate, object] = data
    addTriple(pointer, {
      subject,
      predicate,
      object,
    }, context, options)
  }
  // Silently ignore arrays with < 2 elements
}

/**
 * Convert value to literal if possible
 */
function asLiteral (value) {
  const type = typeof value
  if (type === 'string' || type === 'boolean' || type === 'number') {
    return String(value)
  }
  return null
}

/**
 * Process YAML-like object data
 */
function populateYamlLike (data, context, options) {
  const { pointer } = context

  for (const [predicate, value] of Object.entries(data)) {
    if (reservedProperties.has(predicate)) {
      continue
    }

    processValue(pointer, predicate, value, context, options)
  }
}

/**
 * Process a single value based on its type
 */
function processValue (pointer, predicate, value, context, options) {
  // Handle primitives
  const literal = asLiteral(value)
  if (literal !== null) {
    addTriple(pointer, {
      subject: pointer.term,
      predicate,
      object: literal,
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
      object: childNode,
    }, context, options)

    // Recursively process the nested object
    populateYamlLike(value, {
      ...context,
      pointer: pointer.node(childNode),
    }, options)
  }
}

function isString (myVar) {
  return typeof myVar === 'string' || myVar instanceof String
}

export { populateYamlLike, populateInline }
