import ns from '../namespaces.js'
import { isString } from '../strings/string.js'

const customMapper = ({ subject, predicate, object }, context) => {

  return {
    resolvedSubject: undefined,
    resolvedPredicate: isString(predicate) ? inspectStr(predicate) : undefined,
    resolvedObject: isString(object) ? inspectStr(object) : undefined,
  }
}

function inspectStr (predStr) {
  if (predStr) {
    // Predicate is of the form schema:name
    if (predStr.split(':').length === 2) {
      const [vocabulary, property] = predStr.split(':')
      return ns[vocabulary] ? ns[vocabulary][property] : undefined
    }

    const values = {
      'is a': ns.rdf.type,
    }
    return values[predStr]
  }
}

export { customMapper }
