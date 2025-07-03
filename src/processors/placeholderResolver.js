import { nameFromUri, pathToUri } from '../termMapper/termMapper.js'

function resolvePlaceholders(pointer, getPathByName) {
  const resolveTerm = (term) => {
    if (term.termType !== 'NamedNode') return term

    const placeholderName = nameFromUri(term)
    if (!placeholderName) return term

    const resolvedPath = getPathByName(placeholderName)
    return resolvedPath?.path ? pathToUri(resolvedPath.path) : term
  }

  // Process all quads and collect replacements
  const replacements = []

  for (const quad of pointer.dataset) {
    const resolved = {
      subject: resolveTerm(quad.subject),
      predicate: resolveTerm(quad.predicate),
      object: resolveTerm(quad.object)
    }

    // Check if any term changed
    if (resolved.subject !== quad.subject ||
      resolved.predicate !== quad.predicate ||
      resolved.object !== quad.object) {
      replacements.push({ quad, resolved })
    }
  }

  // Apply all replacements
  for (const { quad, resolved } of replacements) {
    pointer.dataset.delete(quad)
    pointer.dataset.add(
      pointer.factory.quad(resolved.subject, resolved.predicate, resolved.object)
    )
  }

  return pointer
}

export { resolvePlaceholders }
