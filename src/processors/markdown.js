import { simpleAst } from 'docs-and-graphs'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import ns from '../namespaces.js'
import { MarkdownTriplifierOptions } from '../schemas.js'
import { appendSelector, pathToFileURL } from '../termMapper/termMapper.js'
import { toTerm } from '../utils/uris.js'
import { getKnownLinks, populateLink } from './links.js'
import { populateInline, populateYamlLike } from './populateData.js'

// ============================================================================
// Constants & Configuration
// ============================================================================

const NODE_TYPES = {
  ROOT: 'root',
  BLOCK: 'block',
  CODE: 'code',
}

const DEFAULT_AST_OPTIONS = {
  normalize: true,
  inlineAsArray: true,
  includePosition: true,
}

// ============================================================================
// Selector Management Functions
// ============================================================================

/**
 * Creates a selector manager state
 * @returns {Object} Selector manager state
 */
const createSelectorManager = () => ({
  previousSelector: null,
})

/**
 * Creates a new text position selector
 * @private
 */
const createNewSelector = (node, documentTerm, startOffset) => {
  let selectorPointer = null

  node.addOut(ns.oa.hasSource, documentTerm).addOut(ns.oa.hasSelector, sel => {
    selectorPointer = sel
    return sel.addOut(ns.rdf.type, ns.oa.TextPositionSelector).
      addOut(ns.oa.start, toRdf(startOffset)).
      addOut(ns.oa.end, toRdf(startOffset)) // Temporary end
  })

  return selectorPointer
}

/**
 * Updates a selector's end position
 * @private
 */
const updateSelectorEnd = (selectorPointer, endOffset) => {
  // Remove old end quads
  const endQuads = Array.from(selectorPointer.dataset).filter(quad =>
    quad.subject.equals(selectorPointer.term) &&
    quad.predicate.equals(ns.oa.end),
  )

  endQuads.forEach(quad => selectorPointer.dataset.delete(quad))

  // Add new end
  selectorPointer.addOut(ns.oa.end, toRdf(endOffset))
}

/**
 * Creates a selector and updates the previous one
 * @param {Object} selectorManager - Selector manager state
 * @param {Object} node - RDF node
 * @param {Object} documentTerm - Document URI
 * @param {Object} position - Position object
 * @returns {Object} Updated selector manager state
 */
const createSelector = (selectorManager, node, documentTerm, position) => {
  const { start } = position

  // Update previous selector's end position
  if (selectorManager.previousSelector) {
    updateSelectorEnd(selectorManager.previousSelector, start.offset)
  }

  // Create new selector
  const selectorPointer = createNewSelector(node, documentTerm, start.offset)

  return {
    ...selectorManager,
    previousSelector: selectorPointer,
  }
}

/**
 * Finalizes the last selector
 * @param {Object} selectorManager - Selector manager state
 * @param {number} documentEndOffset - Document end offset
 * @returns {Object} Reset selector manager state
 */
const finalizeSelector = (selectorManager, documentEndOffset) => {
  if (selectorManager.previousSelector) {
    updateSelectorEnd(selectorManager.previousSelector, documentEndOffset)
  }
  return createSelectorManager()
}

// ============================================================================
// URI Generation Strategies
// ============================================================================

/**
 * Generic header strategy implementation
 * @private
 */
const headerStrategy = (depthPredicate) => (node, pointer) => {
  if (node.type === NODE_TYPES.BLOCK && node.value) {
    if (!node.depth || depthPredicate(node.depth)) {
      return createHeaderUri(node, pointer)
    }
  }
  return null
}

/**
 * URI generation strategies
 */
const URI_STRATEGIES = {
  'headers-all': headerStrategy(() => true),
  'headers-h1-h2': headerStrategy(depth => depth <= 2),
  'headers-h2-h3': headerStrategy(depth => depth >= 2 && depth <= 3),
  'headers-h1-h2-h3': headerStrategy(depth => depth <= 3),
}

// ============================================================================
// URI Extraction & Generation
// ============================================================================

/**
 * Checks if data is YAML-like object
 * @private
 */
const isYamlLikeData = (data) =>
  typeof data === 'object' && data !== null && !Array.isArray(data)

/**
 * Checks if data is inline URI array
 * @private
 */
const isInlineUriData = (data) =>
  Array.isArray(data) && data.length === 2 && data[0] === 'uri'

/**
 * Finds URI in a data array
 * @private
 */
const findUriInDataArray = (dataArray) => {
  if (!dataArray) return null

  for (const data of dataArray) {
    if (isYamlLikeData(data) && data.uri) {
      return data.uri
    }

    if (isInlineUriData(data)) {
      return data[1]
    }
  }

  return null
}

/**
 * Extracts custom URI declaration from node data
 * @param {Object} node - Node to extract URI from
 * @returns {string|null} Custom URI or null
 */
const extractCustomUri = (node) => {
  // Check node's own data
  const nodeUri = findUriInDataArray(node.data)
  if (nodeUri) return nodeUri

  // Check children's data
  if (node.children) {
    for (const child of node.children) {
      const childUri = findUriInDataArray(child.data)
      if (childUri) return childUri
    }
  }

  return null
}

/**
 * Gets custom URI with caching
 * @private
 */
const getCachedCustomUri = (node) => {
  if (node._cachedCustomUri === undefined) {
    node._cachedCustomUri = extractCustomUri(node)
  }
  return node._cachedCustomUri
}

/**
 * Generates default URI for a node
 * @private
 */
const generateDefaultUri = (node, pointer) => {
  const id = node.value

  return pointer.term.termType === 'BlankNode'
    ? rdf.blankNode()
    : appendSelector(pointer.term, `#${id}`)
}

/**
 * Creates a URI for header nodes
 * @param {Object} node - Header node
 * @param {Object} pointer - RDF pointer
 * @returns {Object} URI configuration
 */
const createHeaderUri = (node, pointer) => {
  // Try custom URI first (with caching)
  const customUri = getCachedCustomUri(node)
  if (customUri) {
    return {
      shouldSplit: true,
      childUri: toTerm(customUri),
    }
  }

  // Generate default URI
  const childUri = generateDefaultUri(node, pointer)
  return { shouldSplit: true, childUri }
}

// ============================================================================
// Node Processing Functions
// ============================================================================

/**
 * Normalizes a value to array
 * @param {*} value - Value to normalize
 * @returns {Array} Normalized array
 */
const normalizeToArray = (value) => {
  if (!value) return []
  if (typeof value === 'string') return [value]
  return value
}

/**
 * Tries to parse content as Turtle
 * @private
 */
const tryParseTurtle = (content, pointer, language) => {
  try {
    const parser = new Parser()
    const quads = parser.parse(content)
    quads.forEach(quad => pointer.dataset.add(quad))
  } catch (error) {
    console.warn(`Failed to parse turtle in ${language} block:`, error.message)
  }
}

/**
 * Adds metadata to code block
 * @private
 */
const addCodeBlockMetadata = (pointer, language, content, includeContent) => {
  pointer.addOut(ns.rdf.type, ns.dot.Code).
    addOut(ns.dot.language, rdf.literal(language))

  if (includeContent) {
    pointer.addOut(ns.dot.content, rdf.literal(content))
  }
}

/**
 * Processes code block nodes
 * @param {Object} node - Code block node
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Object} Code pointer
 */
const processCodeBlock = (node, context, options) => {
  const { pointer, path, selectorManager } = context
  const {
    includeSelectors,
    includeCodeBlockContent,
    parseCodeBlockTurtleIn,
  } = options

  // Extract code metadata
  const codeContent = node.value
  const language = node.lang || 'plaintext'

  // Create code block node
  const codeUri = rdf.blankNode()
  const codePointer = pointer.node(codeUri)

  // Add to container
  pointer.addOut(ns.dot.contains, codeUri)

  // Try parsing as Turtle if applicable
  if (parseCodeBlockTurtleIn.includes(language)) {
    tryParseTurtle(codeContent, codePointer, language)
  }

  // Add code block metadata
  addCodeBlockMetadata(codePointer, language, codeContent,
    includeCodeBlockContent)

  // Add position selector if needed
  if (includeSelectors && node.position && selectorManager) {
    const documentTerm = pathToFileURL(path)
    const updatedManager = createSelector(selectorManager, codePointer,
      documentTerm, node.position)
    context.selectorManager = updatedManager
  }

  return codePointer
}

/**
 * Processes node tags
 * @param {Object} node - Node with tags
 * @param {Object} pointer - RDF pointer
 */
const processNodeTags = (node, pointer) => {
  const tags = normalizeToArray(node.tags)

  for (const tag of tags) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }
}

/**
 * Processes node data and links
 * @param {Object} node - Node to process
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Array} Known links array
 */
const processNodeData = (node, context, options) => {
  // Get known links (skip for code blocks)
  const knownLinks = (node.links && node.type !== NODE_TYPES.CODE)
    ? getKnownLinks(node.links, context, options)
    : []

  // Process data items
  const dataItems = node.data ?? []
  for (const data of dataItems) {
    const populateFn = Array.isArray(data) ? populateInline : populateYamlLike
    populateFn(data, { ...context, knownLinks }, options)
  }

  return knownLinks
}

/**
 * Processes a single node
 * @private
 */
const processNode = (node, context, options) => {
  // Handle code blocks specially
  if (node.type === NODE_TYPES.CODE) {
    processCodeBlock(node, context, options)
    return []
  }

  // Process tags and data
  processNodeTags(node, context.pointer)
  return processNodeData(node, context, options)
}

// ============================================================================
// Labels and Annotations
// ============================================================================

/**
 * Adds labels to a node
 * @private
 */
const addNodeLabels = (node, pointer, includeLabelsFor) => {
  if (includeLabelsFor.includes('sections') && node.value) {
    pointer.addOut(ns.rdfs.label, rdf.literal(node.value))
  }
}

/**
 * Sets up annotation relationships
 * @private
 */
const setupChildAnnotation = (childPointer, parentPointer, childUri) => {
  childPointer.addOut(ns.rdf.type, ns.oa.Annotation)
  parentPointer.addOut(ns.dot.contains, childUri)
}

// ============================================================================
// URI Assignment Functions
// ============================================================================

/**
 * Determines URI generation strategy for a node
 * @param {Object} node - Node to check
 * @param {Object} pointer - RDF pointer
 * @param {Array} partitionBy - Partitioning strategies
 * @returns {Object} URI result
 */
const getNodeUri = (node, pointer, partitionBy) => {
  // Try each partitioning strategy
  for (const strategyName of partitionBy) {
    const strategy = URI_STRATEGIES[strategyName]
    if (strategy) {
      const result = strategy(node, pointer)
      if (result) {
        return result
      }
    }
  }

  return { shouldSplit: false }
}

/**
 * Recursively assigns URIs to nodes
 * @param {Object} node - Node to process
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Map} URI lookup table
 */
const assignInternalUris = (node, context, options) => {
  const uriLookup = new Map()

  const processNodeForUri = (currentNode) => {
    const result = getNodeUri(currentNode, context.pointer, options.partitionBy)

    if (result?.childUri) {
      currentNode.uri = result.childUri

      // Add headers to lookup table
      if (currentNode.type === NODE_TYPES.BLOCK && currentNode.value) {
        uriLookup.set(currentNode.value, result.childUri)
      }
    }

    // Process children
    const children = currentNode.children ?? []
    children.forEach(processNodeForUri)
  }

  // Process all nodes
  const children = node.children ?? []
  children.forEach(processNodeForUri)

  return uriLookup
}

// ============================================================================
// AST Traversal Functions
// ============================================================================

/**
 * Processes unmapped links
 * @private
 */
const processUnmappedLinks = (knownLinks, context, options) => {
  knownLinks.filter(link => !link.mapped).
    forEach(link => populateLink(link, context, options))
}

/**
 * Processes a child that needs its own URI
 * @private
 */
const processSplitChild = (child, context, options) => {
  const { pointer, path, selectorManager } = context
  const { includeLabelsFor, includeSelectors } = options

  const childPointer = pointer.node(child.uri)

  // Set up annotation
  setupChildAnnotation(childPointer, pointer, child.uri)

  // Add labels if requested
  addNodeLabels(child, childPointer, includeLabelsFor)

  // Add position selector if needed
  if (includeSelectors && child.type === NODE_TYPES.BLOCK && child.position) {
    const documentTerm = pathToFileURL(path)
    context.selectorManager = createSelector(selectorManager, childPointer,
      documentTerm, child.position)
  }

  // Recursively process child
  return traverseNode(child, { ...context, pointer: childPointer }, options)
}

/**
 * Processes a single child node
 * @private
 */
const processChild = (child, context, options) => {
  const { shouldSplit } = getNodeUri(child, context.pointer,
    options.partitionBy)

  if (shouldSplit) {
    return processSplitChild(child, context, options)
  } else {
    return traverseNode(child, context, options)
  }
}

/**
 * Traverses and processes a single node
 * @private
 */
const traverseNode = (node, context, options) => {
  const { pointer, path } = context

  // Handle root node specially
  const activePointer = node.type === NODE_TYPES.ROOT
    ? pointer.node(pathToFileURL(path))
    : pointer

  // Process current node
  const knownLinks = processNode(node, { ...context, pointer: activePointer },
    options)

  // Process unmapped links
  processUnmappedLinks(knownLinks, { ...context, pointer: activePointer },
    options)

  // Process children
  const children = node.children ?? []
  children.forEach(child => processChild(child, context, options))

  return pointer
}

/**
 * Main markdown processing function
 * @param {Object} node - Root AST node
 * @param {Object} context - Processing context
 * @param {Object} options - Processing options
 * @returns {Object} RDF pointer
 */
const processMarkdownAST = (node, context, options) => {
  // Create selector manager
  const selectorManager = createSelectorManager()

  // Pre-process: assign URIs
  const uriLookup = assignInternalUris(node, context, options)

  // Process AST with selector tracking
  const extendedContext = {
    ...context,
    rootNode: node,
    selectorManager,
    uriLookup,
  }

  const result = traverseNode(node, extendedContext, options)

  // Finalize selectors
  if (context.text) {
    finalizeSelector(selectorManager, context.text.length)
  }

  return result
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Process Markdown text to RDF
 * @param {string} fullText - Markdown content
 * @param {Object} context - Processing context with pointer and path
 * @param {Object} options - Processing options
 * @returns {Object} RDF pointer with generated triples
 */
export function processMarkdown (fullText, { pointer, path }, options = {}) {
  // Parse markdown to AST
  const node = simpleAst(fullText, DEFAULT_AST_OPTIONS)

  // Parse and validate options
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  // Process the AST
  return processMarkdownAST(node, {
    pointer,
    path,
    text: fullText,
  }, parsedOptions)
}
