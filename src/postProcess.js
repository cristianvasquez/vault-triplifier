import { resolvePlaceholders } from './processors/resolveExternalPaths.js'
import { addLabels } from './processors/appendLabels.js'

function postProcess ({ pointer, getPathByName }, options) {

  // Step 1: Resolve placeholder URIs to actual paths
  resolvePlaceholders(pointer, getPathByName)

  // Step 2: Add labels to properties
  if (options.includeLabelsFor.includes('properties')) {
    addLabels(pointer)
  }

  return pointer
}

export { postProcess }
