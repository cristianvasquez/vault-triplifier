import rdf from '../rdf-ext.js'

class Base64UriMinter {
  constructor (stringBase) {
    this.namespace = rdf.namespace(stringBase)
  }

  toUri (value) {
    return this.namespace[Buffer.from(value).toString('base64')]
  }

  toValue (term) {
    if (!this.belongs(term)) {
      return undefined
    }

    const base64Encoded = term.value.replace(
      new RegExp(`^${this.namespace().value}`), '')
    return Buffer.from(base64Encoded, 'base64').toString('utf8')
  }

  belongs (term) {
    return term.termType === 'NamedNode' &&
      term.value.startsWith(this.namespace().value)
  }

}

class SimpleUriMinter {
  constructor (stringBase) {
    this.namespace = rdf.namespace(stringBase)
  }

  toUri (value) {
    return this.namespace[encodeURI(value)]
  }

  toValue (term) {
    if (!this.belongs(term)) {
      return undefined
    }

    const withoutBase = term.value.replace(
      new RegExp(`^${this.namespace().value}`), '')
    return decodeURI(withoutBase)
  }

  belongs (term) {
    return term.termType === 'NamedNode' &&
      term.value.startsWith(this.namespace().value)
  }

}

export { Base64UriMinter, SimpleUriMinter }
