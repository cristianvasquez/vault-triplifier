/**
 * Gets file extension in lowercase
 * @param {string} filePath - File path
 * @returns {string} File extension including the dot (e.g., '.md')
 */
export function getFileExtension (filePath) {
  const lastDot = filePath.lastIndexOf('.')
  return lastDot === -1 ? '' : filePath.slice(lastDot).toLowerCase()
}

/**
 * Get file extension without the dot
 * @param {string} filePath - File path
 * @returns {string} File extension without dot (e.g., 'md')
 */
export function getExtensionNoDot (filePath) {
  const ext = getFileExtension(filePath)
  return ext.startsWith('.') ? ext.slice(1) : ext
}
