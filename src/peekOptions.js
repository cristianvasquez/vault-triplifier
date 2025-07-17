import { parse as parseYAML } from 'yaml'
import { MarkdownTriplifierOptions } from './schemas.js'

const deepMerge = (target, source) =>
  Object.entries(source).reduce((merged, [key, value]) => ({
    ...merged,
    [key]: isPlainObject(value) && isPlainObject(target[key])
      ? deepMerge(target[key], value)
      : value,
  }), { ...target })

const isPlainObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)

const extractFrontmatter = content => {
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  try {
    return parseYAML(match[1]) || {}
  } catch (error) {
    console.warn('Malformed frontmatter detected:', error.message)
    return {}
  }
}

const filterBySchema = (obj, schema) => {
  const validKeys = new Set(Object.keys(schema.shape))
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => validKeys.has(key)),
  )
}

// 1. ✅ includeSelectors: false - overwritten (was true by default)
// 2. ✅ includeCodeBlockContent: false - overwritten (was true by default)
// 3. ✅ includeRaw: false - overwritten (was false by default, stays false)
// 4. ✅ partitionBy: none → [] - overwritten (was ['identifier'] by default)
// 5. ✅ mappings - deep merged (keeps default "is a": "rdf:type" and "same as": "rdfs:sameAs" while adding "custom prop": "schema:name")
const peekMarkdown = (content, options = {}) => {
  const frontmatter = extractFrontmatter(content)
  const filtered = filterBySchema(frontmatter, MarkdownTriplifierOptions)
  const defaults = MarkdownTriplifierOptions.parse({})

  // Handle special partitionBy: none case
  if (filtered.partitionBy === 'none') {
    filtered.partitionBy = []
  }
  if (options.partitionBy === 'none') {
    options.partitionBy = []
  }

  // Merge with special handling for nested objects vs primitives/arrays
  const mergedOptions = { ...defaults }

  // Apply frontmatter
  for (const [key, value] of Object.entries(filtered)) {
    if (key === 'mappings') {
      mergedOptions[key] = deepMerge(mergedOptions[key], value)
    } else {
      mergedOptions[key] = value // Overwrite everything else
    }
  }

  // Apply explicit options (always overwrite)
  for (const [key, value] of Object.entries(options)) {
    if (key === 'mappings') {
      mergedOptions[key] = deepMerge(mergedOptions[key], value)
    } else {
      mergedOptions[key] = value // Overwrite everything else
    }
  }

  return mergedOptions
}

const peekDefault = (content, options = {}) =>
  MarkdownTriplifierOptions.parse(options)

export { peekMarkdown, peekDefault }
