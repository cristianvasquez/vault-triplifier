import { canvasTriplifier } from './triplifiers/canvasTriplifier.js'

const defaultOptions = {
  addLabels: false,
}

function canvasToRDF (contents, { termMapper, pointer, path }, options = {}) {

  const shouldParse = (contents) => (typeof contents === 'string' ||
    contents instanceof String)
  const json = shouldParse(contents) ? JSON.parse(contents) : contents

  return canvasTriplifier(json, {
    pointer, termMapper, path,
  }, { ...defaultOptions, ...options })

}

export { canvasToRDF }
