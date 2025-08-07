import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import { Parser } from 'n3'
import ns from '../namespaces.js'
import { MarkdownTriplifierOptions } from '../schemas.js'
import { appendSelector, pathToFileURL } from '../termMapper/termMapper.js'
import { getKnownLinks, populateLink } from './links.js'
import { populateInline, populateYamlLike } from './populateData.js'
import { simpleAst } from 'docs-and-graphs'
import { toTerm } from '../utils/uris.js'

/**
 * Manages text position selectors for RDF annotations
 */
class SelectorManager {
  constructor () {
    this.previousSelector = null
  }

  /**
   * Creates a new selector and updates the previous one's end position
   * @param {Object} node - RDF node to attach selector to
   * @param {Object} documentTerm - Document URI
   * @param {Object} position - Position object with start/end offsets
   * @returns {Object} The created selector pointer
   */
  createSelector (node, documentTerm, position) {
    const { start } = position

    // Update previous selector's end position
    if (this.previousSelector) {
      this.updateSelectorEnd(this.previousSelector, start.offset)
    }

    // Create new selector
    let selectorPointer = null
    node.addOut(ns.oa.hasSource, documentTerm).
      addOut(ns.oa.hasSelector, sel => {
        selectorPointer = sel
        return sel.addOut(ns.rdf.type, ns.oa.TextPositionSelector).
          addOut(ns.oa.start, toRdf(start.offset)).
          addOut(ns.oa.end, toRdf(start.offset)) // Temporary end
      })

    this.previousSelector = selectorPointer
    return selectorPointer
  }

  /**
   * Updates a selector's end position
   * @param {Object} selectorPointer - Selector to update
   * @param {number} endOffset - New end offset
   */
  updateSelectorEnd (selectorPointer, endOffset) {
    // Remove old end quad
    const endQuads = Array.from(selectorPointer.dataset).filter(quad =>
      quad.subject.equals(selectorPointer.term) &&
      quad.predicate.equals(ns.oa.end),
    )

    endQuads.forEach(quad => selectorPointer.dataset.delete(quad))

    // Add new end
    selectorPointer.addOut(ns.oa.end, toRdf(endOffset))
  }

  /**
   * Finalizes the last selector with document end position
   * @param {number} documentEndOffset - Document end offset
   */
  finalize (documentEndOffset) {
    if (this.previousSelector) {
      this.updateSelectorEnd(this.previousSelector, documentEndOffset)
      this.previousSelector = null
    }
  }

  reset () {
    this.previousSelector = null
  }
}

/**
 * Configuration for node URI generation strategies
 */
const URI_STRATEGIES = {
  'headers-all': (node, pointer) => {
    if (node.type === 'block' && node.value) {
      return createHeaderUri(node, pointer)
    }
    return null
  },

  'headers-h1-h2': (node, pointer) => {
    if (node.type === 'block' && node.depth && node.depth <= 2) {
      return createHeaderUri(node, pointer)
    }
    return null
  },

  'headers-h2-h3': (node, pointer) => {
    if (node.type === 'block' && node.depth && node.depth >= 2 && node.depth <= 3) {
      return createHeaderUri(node, pointer)
    }
    return null
  },

  'headers-h1-h2-h3': (node, pointer) => {
    if (node.type === 'block' && node.depth && node.depth <= 3) {
      return createHeaderUri(node, pointer)
    }
    return null
  },
}

/**
 * Extracts custom URI declaration from node data
 */
function extractCustomUri(node) {
  // Helper to extract URI from data array
  function findUriInData(dataArray) {
    if (!dataArray) return null
    
    for (const data of dataArray) {
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        // YAML-like object data
        if (data.uri) return data.uri
      } else if (Array.isArray(data) && data.length === 2 && data[0] === 'uri') {
        // Inline array data [predicate, object]
        return data[1]
      }
    }
    return null
  }

  // Check node's own data first
  const nodeUri = findUriInData(node.data)
  if (nodeUri) return nodeUri

  // Check children's data
  if (node.children) {
    for (const child of node.children) {
      const childUri = findUriInData(child.data)
      if (childUri) return childUri
    }
  }

  return null
}

/**
 * Creates a URI for header nodes
 */
function createHeaderUri (node, pointer) {
  const id = node.value
  
  // Check if we already computed the custom URI for this node
  if (node._cachedCustomUri !== undefined) {
    if (node._cachedCustomUri) {
      const childUri = toTerm(node._cachedCustomUri)  // Returns NamedNode or Literal directly
      return { shouldSplit: true, childUri }
    }
  } else {
    // First time - extract and cache the custom URI
    const customUri = extractCustomUri(node)
    node._cachedCustomUri = customUri // Cache result (could be null)
    
    if (customUri) {
      const childUri = toTerm(customUri)  // Returns NamedNode or Literal directly
      return { shouldSplit: true, childUri }
    }
  }
  
  // Default behavior - generate URI from header text
  const childUri = pointer.term.termType === 'BlankNode'
    ? rdf.blankNode()
    : appendSelector(pointer.term, `#${id}`)
  return { shouldSplit: true, childUri }
}

/**
 * Processes code block nodes and generates RDF triples
 */
function processCodeBlock (node, context, options) {
  const { pointer, path, selectorManager } = context
  const {
    includeSelectors,
    includeCodeBlockContent,
    parseCodeBlockTurtleIn,
  } = options

  // Extract code content and language
  const codeContent = node.value
  const language = node.lang || 'plaintext'

  // Create a blank node for the code block
  const codeUri = rdf.blankNode()
  const codePointer = pointer.node(codeUri)

  // Add to container
  pointer.addOut(ns.dot.contains, codeUri)

  // Parse as turtle if language matches
  if (parseCodeBlockTurtleIn.includes(language)) {
    try {
      const parser = new Parser()
      const quads = parser.parse(codeContent)
      for (const quad of quads) {
        codePointer.dataset.add(quad)
      }
    } catch (error) {
      console.warn(`Failed to parse turtle in ${language} block:`,
        error.message)
    }
  }

  // Add code block metadata
  codePointer.addOut(ns.rdf.type, ns.dot.Code).
    addOut(ns.dot.language, rdf.literal(language))

  // Include content if requested
  if (includeCodeBlockContent) {
    codePointer.addOut(ns.dot.content, rdf.literal(codeContent))
  }

  // Add position selector if needed
  if (includeSelectors && node.position && selectorManager) {
    const documentTerm = pathToFileURL(path)
    selectorManager.createSelector(codePointer, documentTerm, node.position)
  }

  return codePointer
}

/**
 * Main function to convert Markdown AST to RDF
 * @param {Object} node - Markdown AST root node
 * @param {Object} context - Processing context
 * @param {Object} options - Triplifier options
 * @returns {Object} RDF pointer
 */
function markdown (node, context, options) {
  const selectorManager = new SelectorManager()

  // Pre-process: assign URIs to all nodes
  assignInternalUris(node, context, options)

  // Process AST with selector tracking
  const extendedContext = {
    ...context,
    rootNode: node,
    selectorManager,
  }
  const result = traverseAst(node, extendedContext, options)

  // Finalize last selector
  if (context.text) {
    selectorManager.finalize(context.text.length)
  }

  return result
}

/**
 * Recursively assigns URIs to nodes that need them
 */
function assignInternalUris (node, context, options) {
  const children = node.children ?? []
  const uriLookup = new Map() // Simple lookup table for internal links

  function processNodeForUri(currentNode) {
    const result = getNodeUri(currentNode, context, options)
    if (result && result.childUri) {
      currentNode.uri = result.childUri
      // If this is a header, add to lookup table for internal links
      if (currentNode.type === 'block' && currentNode.value) {
        uriLookup.set(currentNode.value, result.childUri)
      }
    }
    
    // Process children
    const nodeChildren = currentNode.children ?? []
    for (const child of nodeChildren) {
      processNodeForUri(child)
    }
  }

  // Process all nodes and build lookup table
  for (const child of children) {
    processNodeForUri(child)
  }

  // Attach lookup table to context for internal link resolution
  context.uriLookup = uriLookup
}

/**
 * Traverses AST and generates RDF triples
 */
function traverseAst (node, context, options) {
  const { includeLabelsFor, includeSelectors } = options
  const { pointer, path, selectorManager } = context

  // This is a hack due to bad design, this needs to be revisited
  const _pointer = node.type === 'root' ? pointer.node(
    pathToFileURL(path)) : pointer

  // Process current node using consolidated processor
  const knownLinks = processNode(node, { ...context, pointer: _pointer }, options)

  // Process unmapped links
  knownLinks.filter(link => !link.mapped).
    forEach(
      link => populateLink(link, { ...context, pointer: _pointer }, options))

  // Process children
  const children = node.children ?? []
  for (const child of children) {
    processChild(child, context, options)
  }

  return pointer
}

/**
 * Consolidated node processor that handles tags, data, and links
 */
function processNode(node, context, options) {
  const { pointer } = context

  // Handle code blocks specially
  if (node.type === 'code') {
    processCodeBlock(node, context, options)
    return [] // No links to return
  }

  // Process node tags
  processNodeTags(node, pointer)

  // Process data and links  
  return processNodeData(node, context, options)
}

/**
 * Consolidated child processor that handles URI splitting and recursion
 */
function processChild(child, context, options) {
  const { includeLabelsFor, includeSelectors } = options
  const { pointer, path, selectorManager } = context
  const { shouldSplit } = getNodeUri(child, context, options)

  if (shouldSplit) {
    const childPointer = pointer.node(child.uri)

    // Set up annotation
    childPointer.addOut(ns.rdf.type, ns.oa.Annotation)
    pointer.addOut(ns.dot.contains, child.uri)

    // Add labels if requested
    addNodeLabels(child, childPointer, includeLabelsFor)

    // Add position selector if needed
    if (includeSelectors && child.type === 'block' && child.position) {
      const documentTerm = pathToFileURL(path)
      selectorManager.createSelector(childPointer, documentTerm, child.position)
    }

    // Recursively process child
    traverseAst(child, { ...context, pointer: childPointer }, options)
  } else {
    // Process in-place without creating new node
    traverseAst(child, context, options)
  }
}

function processNodeTags(node, pointer) {
  let tags = node.tags ?? []

  // If tags is a string, convert to single-element array
  if (typeof tags === 'string') {
    tags = [tags]
  }

  for (const tag of tags) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }
}


/**
 * Processes data and links for a node
 */
function processNodeData (node, context, options) {
  const knownLinks = (node.links && node.type !== 'code')
    ? getKnownLinks(node.links, context, options)
    : []

  const dataItems = node.data ?? []
  for (const data of dataItems) {
    const populateFn = Array.isArray(data) ? populateInline : populateYamlLike
    populateFn(data, { ...context, knownLinks }, options)
  }

  return knownLinks
}

/**
 * Processes a child node
 */
function processChildNode (child, context, options) {
  const { includeLabelsFor, includeSelectors } = options
  const { pointer, path, selectorManager } = context
  const { shouldSplit } = getNodeUri(child, context, options)

  if (shouldSplit) {
    const childPointer = pointer.node(child.uri)

    // Set up annotation
    childPointer.addOut(ns.rdf.type, ns.oa.Annotation)
    pointer.addOut(ns.dot.contains, child.uri)

    // Add labels if requested
    addNodeLabels(child, childPointer, includeLabelsFor)

    // Add position selector if needed
    if (includeSelectors && child.type === 'block' && child.position) {
      const documentTerm = pathToFileURL(path)
      selectorManager.createSelector(childPointer, documentTerm, child.position)
    }

    // Recursively process child
    traverseAst(child, { ...context, pointer: childPointer }, options)
  } else {
    // Process in-place without creating new node
    traverseAst(child, context, options)
  }
}

/**
 * Adds appropriate labels to a node
 */
function addNodeLabels (node, pointer, includeLabelsFor) {
  // Add section label for headers
  if (includeLabelsFor.includes('sections') && node.value) {
    pointer.addOut(ns.rdfs.label, rdf.literal(node.value))
  }

}

/**
 * Determines URI generation strategy for a node
 */
function getNodeUri (node, context, options) {
  const { pointer } = context
  const { partitionBy } = options

  // Try each partitioning strategy
  for (const strategy of partitionBy) {
    const strategyFn = URI_STRATEGIES[strategy]
    if (strategyFn) {
      const result = strategyFn(node, pointer)
      if (result) {
        return result
      }
    }
  }

  return { shouldSplit: false }
}

/**
 * Public API: Process Markdown text to RDF
 * @param {string} fullText - Markdown content
 * @param {Object} context - Processing context with pointer and path
 * @param {Object} options - Processing options
 * @returns {Object} RDF pointer with generated triples
 */
export function processMarkdown (fullText, { pointer, path }, options = {}) {
  const astOptions = {
    normalize: true,
    inlineAsArray: true,
    includePosition: true,
  }

  const node = simpleAst(fullText, astOptions)
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  return markdown(node, {
    pointer,
    path,
    text: fullText,
  }, parsedOptions)
}
