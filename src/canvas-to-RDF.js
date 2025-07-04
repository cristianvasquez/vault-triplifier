import { canvasTriplifier } from './triplifiers/canvasTriplifier.js'

import { TriplifierOptions } from './schemas.js'

function canvasToRDF (contents, { termMapper, pointer, path }, options = {}) {

  const shouldParse = (contents) => (typeof contents === 'string' ||
    contents instanceof String)
  const json = shouldParse(contents) ? JSON.parse(contents) : contents

  return canvasTriplifier(json, {
    pointer, termMapper, path,
  }, TriplifierOptions.parse(options))

}

export { canvasToRDF }
