import { resolvePlaceholders } from './processors/placeholderResolver.js'
import { addLabels } from './processors/labelAdder.js'

function postProcess({ pointer, getPathByName }, options) {
  // Step 1: Resolve placeholder URIs to actual paths
  resolvePlaceholders(pointer, getPathByName, options)
  
  // Step 2: Add labels to terms
  addLabels(pointer, options)
  
  return pointer
}

export { postProcess }
