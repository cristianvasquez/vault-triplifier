import rdf from '../rdf-ext.js'

class UriMinter {
  constructor (stringBase) {
    this.namespace = rdf.namespace(stringBase)
  }

  toUri (value) {
    return this.namespace[Buffer.from(value).toString('base64')]
  }

  toValue (uri) {
    const str = (typeof uri === 'string' || uri instanceof String)
      ? uri
      : uri.value

    const base64Encoded = str.replace(new RegExp(`^${this.namespace().value}`),
      '')
    return Buffer.from(base64Encoded, 'base64').toString('utf8')
  }
}

export { UriMinter }
