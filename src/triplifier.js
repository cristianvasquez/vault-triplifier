import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import { peekDefault, peekMarkdown } from './peekOptions.js'
import { addLabels } from './processors/appendLabels.js'
import { processMarkdown } from './processors/markdown.js'
import { processCanvas } from './processors/canvas.js'
import ns from './namespaces.js'
import { MarkdownTriplifierOptions } from './schemas.js'
import { pathToFileURL, nameToUri } from './termMapper/termMapper.js'
import { getNameFromPath, toTerm } from './utils/uris.js'
import { getFileExtension } from './utils/extensions.js'

// File processor registry
const FILE_PROCESSORS = {
  '.md': {
    type: ns.dot.MarkdownDocument,
    processor: processMarkdown,
    lookupOptions: peekMarkdown,
  },
  '.canvas': {
    type: ns.dot.CanvasDocument,
    processor: processCanvas,
    lookupOptions: peekDefault,
  },
}
const defaults = MarkdownTriplifierOptions.parse({})

/**
 * Main triplifier function - converts content to RDF
 *
 * @param {string} path - Path/identifier for the content
 * @param {string} [content] - Optional content to process
 * @param {Object} [options] - Processing options
 * @returns {Grapoi} RDF pointer with processed content
 */
function triplify (path, content, options = defaults) {

  // Process content if we have a processor
  const extension = getFileExtension(path)
  const processor = FILE_PROCESSORS[extension.toLowerCase()]

  // If no content, return concept pointer
  if (!content || !processor) {
    return createConceptPointer(path, options)
  }

  const parsedOptions = processor.lookupOptions(content, options)

  const pointer = createConceptPointer(path, parsedOptions)

  // Add document type and process content
  const documentUri = pathToFileURL(path)
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
 * @returns {Grapoi} Basic RDF pointer
 */
function createConceptPointer (path, options = {}) {

  const documentUri = pathToFileURL(path)

  const name = getNameFromPath(path)
  
  // Process URI using centralized function  
  const term = options.uri 
    ? toTerm(options.uri)  // Returns NamedNode or Literal directly
    : nameToUri(name)

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
