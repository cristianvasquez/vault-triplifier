export {
  triplify as default,
  triplify,
  createConceptPointer,
  registerFileProcessor,
  canProcess,
  getFileExtension,
} from './src/triplifier.js'

// Re-export termMapper for convenience
export {
  propertyToUri,
  propertyFromUri,
  nameToUri,
  nameFromUri,
  newLiteral,
  blockUri,
  fileUri,
} from './src/termMapper/termMapper.js'

// Re-export namespaces for convenience
export { default as ns } from './src/namespaces.js'

// Re-export schemas
export { MarkdownTriplifierOptions } from './src/schemas.js'
