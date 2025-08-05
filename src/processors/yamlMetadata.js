import { parse as parseYAML } from 'yaml'
import { populateYamlLike } from './populateData.js'

/**
 * Extracts YAML frontmatter from markdown content
 * @param {string} content - The full markdown content
 * @returns {Object} Parsed YAML object or empty object if no frontmatter
 */
function extractYamlFrontmatter(content) {
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  try {
    return parseYAML(match[1]) || {}
  } catch {
    return {}
  }
}

/**
 * Filters YAML data to exclude configuration options that shouldn't be converted to RDF
 * @param {Object} yamlData - Raw YAML data
 * @returns {Object} Filtered YAML data for RDF conversion
 */
function filterYamlForRdf(yamlData) {
  const configOptions = new Set([
    'uri',
    'includeLabelsFor', 
    'includeSelectors',
    'includeRaw',
    'partitionBy',
    'includeCodeBlockContent',
    'parseCodeBlockTurtleIn',
    'mappings',
    'prefix'
  ])

  const rdfData = {}
  for (const [key, value] of Object.entries(yamlData)) {
    if (!configOptions.has(key)) {
      rdfData[key] = value
    }
  }
  return rdfData
}

/**
 * Processes YAML frontmatter into RDF triples
 * @param {string} content - Full markdown content with optional frontmatter
 * @param {Object} context - Processing context with pointer and path
 * @param {Object} options - Processing options
 * @returns {Object} Processing context (for chaining)
 */
export function processYamlMetadata(content, context, options = {}) {
  const yamlData = extractYamlFrontmatter(content)
  
  // Filter out configuration options, only convert metadata to RDF
  const rdfData = filterYamlForRdf(yamlData)
  
  // Only process if we have actual metadata to convert
  if (Object.keys(rdfData).length > 0) {
    populateYamlLike(rdfData, context, options)
  }
  
  return context
}

/**
 * Removes YAML frontmatter from markdown content
 * @param {string} content - Full markdown content
 * @returns {string} Markdown content without frontmatter
 */
export function removeYamlFrontmatter(content) {
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return content
  
  // Return content after the frontmatter (including the newline after ---)
  return content.slice(match[0].length)
}

// Re-export for backward compatibility if needed
export { extractYamlFrontmatter, filterYamlForRdf }