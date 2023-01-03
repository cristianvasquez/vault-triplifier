import rdf from '../rdf-ext.js'
import { UriMinter } from './uriMinter.js'

function createTermMapper ({
  baseNamespace, customMapper, getPathByName,
}) {

  const pathUriMinter = new UriMinter(`${baseNamespace().value}note/`)
  const propertyUriMinter = new UriMinter(`${baseNamespace().value}property/`)

  // returns: NamedNode
  function pathToUri (path) {
    return pathUriMinter.toUri(path)
  }

  const maybeMapper = (txt) => customMapper ? customMapper(txt) : undefined

  // To build properties
  // For example, "has name" -> http://some-vault/has-name
  function newProperty (txt, options) {
    return maybeMapper(txt) ?? propertyUriMinter.toUri(txt)
  }

  function newLiteral (txt, options) {
    return maybeMapper(txt) ?? rdf.literal(txt)
  }

  // http://example.com/ + ^blockId -> http://example.com/blockId
  const blockUri = (uri, blockId) => rdf.namedNode(
    `${uri.value}/${blockId.replace(/^\^/, '')}`)

  return {
    newLiteral,
    newProperty,
    blockUri,
    pathToUri,
    getPathByName: getPathByName ? getPathByName.path : (x) => x,
  }

}

export {
  createTermMapper,
}
