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

const peekMarkdown = (content, options = {}) => {
  const frontmatter = extractFrontmatter(content)
  const filtered = filterBySchema(frontmatter, MarkdownTriplifierOptions)
  const defaults = MarkdownTriplifierOptions.parse({})

  return [defaults, filtered, options].reduce(deepMerge)
}

const peekDefault = (content, options = {}) =>
  MarkdownTriplifierOptions.parse(options)

export { peekMarkdown, peekDefault }
