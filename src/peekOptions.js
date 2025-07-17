import { parse as parseYAML } from 'yaml'
import { MarkdownTriplifierOptions } from './schemas.js'

const extractFrontmatter = content => {
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  try {
    return parseYAML(match[1]) || {}
  } catch {
    return {}
  }
}

const peekMarkdown = (content, options = {}) => {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  const frontmatter = extractFrontmatter(content)

  // Start with parsed options (includes defaults + explicit options)
  const result = { ...parsedOptions }

  // List of keys frontmatter can override, with 'none' → []
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

  return result
}

const peekDefault = (content, options = {}) =>
  MarkdownTriplifierOptions.parse(options)

export { peekMarkdown, peekDefault }
