import { nameFromUri, pathToUri } from '../termMapper/termMapper.js'

function resolvePlaceholders(pointer, getPathByName, options) {
  const quadsToReplace = []
  
  const resolvePlaceholder = (term) => {
    if (term.termType !== 'NamedNode') return term
    
    const placeholderName = nameFromUri(term, options)
    if (!placeholderName) return term
    
    const resolvedPath = getPathByName(placeholderName)
    if (resolvedPath?.path) {
      return pathToUri(resolvedPath.path, options)
    }
    
    return term
  }

  for (const quad of pointer.dataset) {
    const newSubject = resolvePlaceholder(quad.subject)
    const newPredicate = resolvePlaceholder(quad.predicate)
    const newObject = resolvePlaceholder(quad.object)

    if (newSubject !== quad.subject || newPredicate !== quad.predicate || newObject !== quad.object) {
      quadsToReplace.push({ 
        old: quad, 
        new: { subject: newSubject, predicate: newPredicate, object: newObject } 
      })
    }
  }

  // Replace quads with resolved placeholders
  for (const { old, new: newQuad } of quadsToReplace) {
    pointer.dataset.delete(old)
    pointer.dataset.add(pointer.factory.quad(newQuad.subject, newQuad.predicate, newQuad.object))
  }

  return pointer
}

export { resolvePlaceholders }