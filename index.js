import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { resolve } from 'path'
import { createConceptPointer, contentToRDF, canProcess, getFileExtension, registerFileProcessor } from './src/file-to-RDF.js'
import { MarkdownTriplifierOptions } from './src/schemas.js'

const DEFAULT_SEARCH_PATTERN = '**/+(*.md|*.png|*.jpg|*.svg|*.canvas)'

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
  const resolvedFile = resolve(file)
  const extension = getFileExtension(resolvedFile)

  // Check if we can process this file type before reading it
  if (!canProcess(extension)) {
    // Return a basic concept pointer for unsupported file types
    return createConceptPointer(resolvedFile, parsedOptions)
  }

  // Only read file content if we have a processor for it
  const content = await readFile(resolvedFile, 'utf8')
  
  // Use the new contentToRDF function
  return await contentToRDF(content, { 
    path: resolvedFile 
  }, parsedOptions)
}


export { triplifyVault, triplifyFile, registerFileProcessor }
