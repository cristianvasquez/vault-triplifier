import { MarkdownTriplifierOptions } from './schemas.js'
import { simpleAst } from 'docs-and-graphs'

// Simple check for plain objects
const isPlainObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)

// Deep merge helper: frontmatter overwrites options
const deepMerge = (base = {}, override = {}) => {
  const result = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      result[key] = deepMerge(base[key], value)
    } else {
      result[key] = value
    }
  }
  return result
}

// Extract YAML frontmatter from AST (single parsing)
const extractFrontmatter = (content) => {
  const astOptions = {
    normalize: true,
    inlineAsArray: true,
    includePosition: false,
  }
  
  try {
    const node = simpleAst(content, astOptions)
    return node.yaml || {}
  } catch {
    return {}
  }
}

const peekMarkdown = (content, options = {}) => {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  const frontmatter = extractFrontmatter(content)

  // Start with parsed options
  const result = { ...parsedOptions }

  // Keys to overwrite frontmatter if present (with 'none' → [] for arrays)
  const keysToOverride = [
    'uri',
    'includeLabelsFor',
    'includeSelectors',
    'includeRaw',
    'partitionBy',
    'includeCodeBlockContent',
    'parseCodeBlockTurtleIn',
  ]

  for (const key of keysToOverride) {
    if (frontmatter[key] !== undefined) {
      if ((key === 'partitionBy' || key === 'includeLabelsFor') && frontmatter[key] === 'none') {
        result[key] = []
      } else {
        result[key] = frontmatter[key]
      }
    }
  }

  // Deep merge mappings if present in frontmatter
  if (frontmatter.mappings !== undefined) {
    result.mappings = deepMerge(parsedOptions.mappings, frontmatter.mappings)
  }

  // Deep merge prefix if present in frontmatter
  if (frontmatter.prefix !== undefined) {
    result.prefix = deepMerge(parsedOptions.prefix, frontmatter.prefix)
  }

  // Parse the final result through Zod to apply transformations (like string-to-boolean)
  return MarkdownTriplifierOptions.parse(result)
}

const peekDefault = (content, options = {}) =>
  MarkdownTriplifierOptions.parse(options)

export { peekMarkdown, peekDefault }
