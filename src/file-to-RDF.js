import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import { canvasToRDF } from './canvas-to-RDF.js'
import { markdownToRDF } from './markdown-to-RDF.js'
import ns from './namespaces.js'
import { addLabels } from './processors/appendLabels.js'
import { MarkdownTriplifierOptions } from './schemas.js'
import { getNameFromPath } from './strings/uris.js'
import { fileUri, nameToUri } from './termMapper/termMapper.js'

// File processor registry for extensibility
const FILE_PROCESSORS = {
  '.md': {
    type: ns.dot.MarkdownDocument,
    processor: markdownToRDF,
  },
  '.canvas': {
    type: ns.dot.CanvasDocument,
    processor: canvasToRDF,
  },
}

/**
 * Creates a basic concept pointer with document metadata
 * @param {string} path - File path
 * @param {Object} options - Processing options
 * @returns {grapoi} Configured pointer with metadata
 */
function createConceptPointer(path, options = {}) {
  const documentUri = fileUri(path)
  const name = getNameFromPath(path)
  const term = nameToUri(name)

  const pointer = grapoi({
    dataset: rdf.dataset(),
    factory: rdf,
    term,
  })

  // Add core relationships
  pointer.addOut(ns.rdf.type, ns.dot.NamedConcept).
    addOut(ns.prov.derivedFrom, documentUri)

  const documentPointer = pointer.node(documentUri)

  documentPointer.
    addOut(ns.dot.represents, term).
    addOut(ns.prov.atLocation, rdf.literal(path)).
    addOut(ns.prov.generatedAtTime, toRdf(new Date()))

  if (options.includeLabelsFor?.includes('documents')) {
    pointer.addOut(ns.rdfs.label, rdf.literal(name))
  }

  return pointer
}

async function contentToRDF(content, { path, pointer }, options = {}) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  // Extract extension from path
  const extension = getFileExtension(path)

  // Check if we have a processor for this extension
  const processor = FILE_PROCESSORS[extension.toLowerCase()]
  if (!processor) {
    throw new Error(`No processor available for file extension: ${extension}`)
  }

  // Create pointer if not provided
  if (!pointer) {
    pointer = createConceptPointer(path, parsedOptions)
  }

  // Get document pointer
  const documentUri = fileUri(path)
  const documentPointer = pointer.node(documentUri)

  // Add document type
  documentPointer.addOut(ns.rdf.type, processor.type)

  // Add raw content if requested
  if (options.includeRaw) {
    documentPointer.addOut(ns.dot.raw, rdf.literal(content))
  }

  // Process content with the appropriate processor
  const result = await processor.processor(content, { path, pointer }, parsedOptions)

  // Add labels for properties if requested
  if (options.includeLabelsFor?.includes('properties')) {
    addLabels(pointer)
  }

  return result
}


/**
 * Check if a file extension can be processed
 * @param {string} extension - File extension to check
 * @returns {boolean} True if extension can be processed
 */
function canProcess(extension) {
  return FILE_PROCESSORS.hasOwnProperty(extension.toLowerCase())
}


/**
 * Gets file extension in lowercase
 * @param {string} filePath - File path
 * @returns {string} File extension including the dot
 */
function getFileExtension(filePath) {
  const lastDot = filePath.lastIndexOf('.')
  return lastDot === -1 ? '' : filePath.slice(lastDot).toLowerCase()
}

/**
 * Registers a new file processor
 * @param {string} extension - File extension (e.g., '.txt')
 * @param {Object} config - Processor configuration
 * @param {string} config.type - RDF type for this file type
 * @param {Function} config.processor - Function to process file content
 */
function registerFileProcessor(extension, config) {
  FILE_PROCESSORS[extension.toLowerCase()] = config
}

export {
  createConceptPointer,
  contentToRDF,
  canProcess,
  getFileExtension,
  registerFileProcessor
}
