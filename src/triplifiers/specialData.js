// This does not work efficiently for backlinks
//
// I need to think more about this.

// Peek URI
// Only supported for YAML
// [ { uri: 'http://www.notes.org/alice' } ]
function peekUri (node) {
  // for (const data of node.data ?? []) {
  //   if (!Array.isArray(data) && data.uri) {
  //     if (isValidUrl(data.uri)) {
  //       return rdf.namedNode(data.uri)
  //     }
  //   }
  // }
  return undefined
}

// const reservedProperties = new Set(['uri'])
const reservedProperties = new Set([])

export { reservedProperties, peekUri }
