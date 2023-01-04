import rdf from '../rdf-ext.js'
import { SimpleUriMinter } from './uriMinter.js'

function createTermMapper ({
  baseNamespace, customMapper, getPathByName,
}) {

  const pathUriMinter = new SimpleUriMinter(`${baseNamespace().value}note/`)
  const propertyUriMinter = new SimpleUriMinter(`${baseNamespace().value}property/`)

  const maybeMapped = (txt) => customMapper ? customMapper(txt) : undefined

  // returns: NamedNode
  function pathToUri (path) {
    return pathUriMinter.toUri(path)
  }

  // To build properties
  // For example, "has name" -> http://some-vault/has-name
  function newProperty (txt, options) {
    return propertyUriMinter.toUri(txt)
  }

  function newLiteral (txt, options) {
    return rdf.literal(txt)
  }

  // http://example.com/ + ^blockId -> http://example.com/blockId
  const blockUri = (uri, blockId) => rdf.namedNode(
    `${uri.value}/${blockId.replace(/^\^/, '')}`)

  return {
    newLiteral,
    newProperty,
    maybeMapped,
    blockUri,
    pathToUri,
    pathUriMinter,
    propertyUriMinter,
    getPathByName: getPathByName ? getPathByName.path : (x) => `${x}.md`,
  }

}

export {
  createTermMapper,
}
