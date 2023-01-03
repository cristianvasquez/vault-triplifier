import { canvasTriplifier } from './triplifiers/canvasTriplifier.js'

const defaultOptions = {
  addLabels: false, includeWikipaths: true,
}

function canvasToRDF (json, { termMapper, pointer, path }, options = {}) {

  canvasTriplifier(json, {
    pointer, termMapper, path,
  }, { ...defaultOptions, ...options })

}

export { canvasToRDF }
