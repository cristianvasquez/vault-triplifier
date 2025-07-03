import { resolvePlaceholders } from './processors/placeholderResolver.js'
import { addLabels } from './processors/labelAdder.js'

function postProcess ({ pointer, getPathByName }, options) {

  // Step 1: Resolve placeholder URIs to actual paths
  resolvePlaceholders(pointer, getPathByName)

  // Step 2: Add labels to properties
  if (options.addLabels) {
    addLabels(pointer)
  }

  return pointer
}

export { postProcess }
