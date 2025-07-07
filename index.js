import { readFile } from 'fs/promises'
import { glob } from 'glob'
import grapoi from 'grapoi'
import { resolve } from 'path'
import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import { canvasToRDF } from './src/canvas-to-RDF.js'
import { markdownToRDF } from './src/markdown-to-RDF.js'
import ns from './src/namespaces.js'
import { addLabels } from './src/processors/appendLabels.js'
import { MarkdownTriplifierOptions } from './src/schemas.js'
import { getNameFromPath } from './src/strings/uris.js'
import { fileUri, nameToUri } from './src/termMapper/termMapper.js'

const DEFAULT_SEARCH_PATTERN = '**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

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
 * Creates an async iterator that streams grapoi pointers for each file in a vault
 * @param {string} dir - Directory path to process
 * @param {Object} options - Processing options
 * @returns {AsyncGenerator<grapoi>} Stream of grapoi pointers, each with {dataset, term} for a document
 */
async function * triplifyVault (dir, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  const files = await glob(DEFAULT_SEARCH_PATTERN, { cwd: dir, absolute: true })

  for (const file of files) {
    const pointer = await triplifyFile(file, parsedOptions)
    yield pointer
  }
}

/**
 * Converts a single file to RDF triples
 * @param {string} file - File path to process
 * @param {Object} options - Processing options
 * @returns {Promise<grapoi>} Grapoi pointer containing the RDF graph
 */
async function triplifyFile (file, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  const documentUri = fileUri(resolve(file))
  const name = getNameFromPath(file)
  const term = nameToUri(name)

  const conceptPointer = grapoi({
    dataset: rdf.dataset(),
    factory: rdf,
    term,
  })

  // Add core relationships
  conceptPointer.addOut(ns.rdf.type, ns.dot.NamedConcept).
    addOut(ns.prov.derivedFrom, documentUri)

  const documentPointer = conceptPointer.node(documentUri)

  documentPointer.
    addOut(ns.dot.represents, term).
    addOut(ns.prov.atLocation, rdf.literal(file)).
    addOut(ns.prov.generatedAtTime, toRdf(new Date()))

  if (options.includeLabelsFor?.includes('documents')) {
    conceptPointer.addOut(ns.rdfs.label, rdf.literal(name))
  }

  // Process file content if processor exists
  const result = await triplifyMediatype(
    { file: resolve(file), documentPointer, conceptPointer }, parsedOptions)
  if (options.includeLabelsFor?.includes('properties')) {
    addLabels(conceptPointer)
  }

  return result
}

/**
 * Processes file content based on its type
 * @private
 */
async function triplifyMediatype (
  { file, documentPointer, conceptPointer }, options) {
  const fileExtension = getFileExtension(file)
  const processor = FILE_PROCESSORS[fileExtension]

  if (!processor) {
    return conceptPointer // No processor for this file type
  }

  // Add document type
  documentPointer.
    addOut(ns.rdf.type, processor.type)

  // Read and process file
  const text = await readFile(file, 'utf8')
  if (options.includeRaw) {
    documentPointer.addOut(ns.dot.raw, rdf.literal(text))
  }
  return await processor.processor(text,
    { path: file, pointer: conceptPointer }, options)
}

/**
 * Gets file extension in lowercase
 * @private
 */
function getFileExtension (filePath) {
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
export function registerFileProcessor (extension, config) {
  FILE_PROCESSORS[extension.toLowerCase()] = config
}

export { triplifyVault, triplifyFile }
