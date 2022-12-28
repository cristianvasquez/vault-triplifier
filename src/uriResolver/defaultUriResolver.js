import { normalize } from 'path'
import rdf from 'rdf-ext'

function createUriResolver () {

  const DEFAULT_NAMESPACE = rdf.namespace('http://www.vault/')

  function getUriFromPath (path) {
    return DEFAULT_NAMESPACE[encodeURI(normalize(path))]
  }

  function toNamed (txt) {
    return DEFAULT_NAMESPACE(encodeURI(txt))
  }

  function toTerm (txt) {
    // If there is something in dictionaries, make it to term, otherwise literal
    return rdf.literal(txt)
  }

  return {
    toTerm, toNamed, getUriFromPath,
  }

}

export {
  createUriResolver,
}
