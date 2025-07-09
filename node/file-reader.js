import { readFile } from 'fs/promises'
import { triplify } from '../index.js'

/**
 * Read and triplify a file from the file system
 * This is the only file with Node.js dependencies
 *
 * @param {string} filePath - Path to the file
 * @param {Object} options - Processing options
 * @returns {Promise<grapoi>} Processed RDF pointer
 */
export async function triplifyFile (filePath, options = {}) {
  const content = await readFile(filePath, 'utf8')
  return triplify(filePath, content, options)
}

/**
 * Read and triplify multiple files
 *
 * @param {string[]} filePaths - Array of file paths
 * @param {Object} options - Processing options
 * @returns {Promise<grapoi[]>} Array of processed RDF pointers
 */
export async function triplifyFiles (filePaths, options = {}) {
  return Promise.all(
    filePaths.map(filePath => triplifyFile(filePath, options)),
  )
}

export default triplifyFile
