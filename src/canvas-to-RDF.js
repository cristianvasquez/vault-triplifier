import { canvasTriplifier } from './triplifiers/canvasTriplifier.js'

import { OptionsSchema } from './schemas.js'

function canvasToRDF (contents, { termMapper, pointer, path }, options = {}) {

  const shouldParse = (contents) => (typeof contents === 'string' ||
    contents instanceof String)
  const json = shouldParse(contents) ? JSON.parse(contents) : contents

  return canvasTriplifier(json, {
    pointer, termMapper, path,
  }, OptionsSchema.parse(options))

}

export { canvasToRDF }
