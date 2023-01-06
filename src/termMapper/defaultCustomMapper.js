import ns from '../namespaces.js'
import { isString } from '../strings/string.js'

// function isImage (term) {
//   return term.termType &&
//     (term.value.endsWith('png') || term.value.endsWith('jpg'))
// }

const customMapper = ({ subject, predicate, object }, context) => {

  // Just an example of custom mapper
  // @TODO clearly separate term mappers and semantic mappers
  // if (isImage(object)) {
  //   return {
  //     resolvedSubject: undefined,
  //     resolvedPredicate: ns.schema.image,
  //     resolvedObject: object,
  //   }
  // }

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
