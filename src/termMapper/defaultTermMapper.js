import rdf from '../rdf-ext.js'
import { UriMinter } from './uriMinter.js'

function createTermMapper ({ baseNamespace, customMapper, vault }) {

  const pathUriMinter = new UriMinter(`${baseNamespace().value}note/`)
  const propertyUriMinter = new UriMinter(`${baseNamespace().value}property/`)

  // returns: NamedNode
  function pathToUri (path) {
    const withoutTrailing = path.startsWith('./') ? path.replace(/^.\//, '') : path
    return pathUriMinter.toUri(withoutTrailing)
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
    blockUri,
    pathToUri,
    getFirstLinkpathDest: vault ? vault.getFirstLinkpathDest : (x) => x,
  }

}

export {
  createTermMapper,
}
