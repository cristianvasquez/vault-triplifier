import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import { addLabels } from './processors/appendLabels.js'
import { processMarkdown } from './processors/markdown.js'
import { processCanvas } from './processors/canvas.js'
import ns from './namespaces.js'
import { MarkdownTriplifierOptions } from './schemas.js'
import { fileUri, nameToUri } from './termMapper/termMapper.js'
import { getNameFromPath } from './utils/uris.js'
import { getFileExtension } from './utils/extensions.js'

// File processor registry
const FILE_PROCESSORS = {
  '.md': {
    type: ns.dot.MarkdownDocument,
    processor: processMarkdown,
  },
  '.canvas': {
    type: ns.dot.CanvasDocument,
    processor: processCanvas,
  },
}

/**
 * Main triplifier function - converts content to RDF
 *
 * @param {string} path - Path/identifier for the content
 * @param {string} [content] - Optional content to process
 * @param {Object} [options] - Processing options
 * @returns {Grapoi} RDF pointer with processed content
 */
function triplify (path, content, options = {}) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  // Create base RDF structure
  const pointer = createBasePointer(path, parsedOptions)

  // If no content, return concept pointer
  if (!content) {
    return pointer
  }

  // Process content if we have a processor
  const extension = getFileExtension(path)
  const processor = FILE_PROCESSORS[extension.toLowerCase()]

  if (!processor) {
    // No processor - return concept pointer with content as raw literal if requested
    if (parsedOptions.includeRaw) {
      const documentUri = fileUri(path)
      pointer.node(documentUri).addOut(ns.dot.raw, rdf.literal(content))
    }
    return pointer
  }

  // Add document type and process content
  const documentUri = fileUri(path)
  const documentPointer = pointer.node(documentUri)
  documentPointer.addOut(ns.rdf.type, processor.type)

  if (parsedOptions.includeRaw) {
    documentPointer.addOut(ns.dot.raw, rdf.literal(content))
  }

  // Process with appropriate processor
  const result = processor.processor(content, { path, pointer },
    parsedOptions)

  // Add labels if requested
  if (parsedOptions.includeLabelsFor?.includes('properties')) {
    addLabels(pointer)
  }

  return result
}

/**
 * Creates a concept pointer without content processing
 *
 * @param {string} path - Path/identifier
 * @param {Object} [options] - Processing options
 * @returns {grapoi} Basic RDF pointer
 */
function createConceptPointer (path, options = {}) {
  return createBasePointer(path, options)
}

/**
 * Internal helper to create base pointer structure
 */
function createBasePointer (path, options = {}) {
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

  documentPointer.addOut(ns.dot.represents, term).
    addOut(ns.prov.atLocation, rdf.literal(path)).
    addOut(ns.prov.generatedAtTime, toRdf(new Date()))

  if (options.includeLabelsFor?.includes('documents')) {
    pointer.addOut(ns.rdfs.label, rdf.literal(name))
  }

  return pointer
}

/**
 * Check if a file extension can be processed
 */
export function canProcess (extension) {
  return FILE_PROCESSORS.hasOwnProperty(extension.toLowerCase())
}

/**
 * Registers a new file processor
 */
export function registerFileProcessor (extension, config) {
  FILE_PROCESSORS[extension.toLowerCase()] = config
}

export { triplify, createConceptPointer, getFileExtension }
