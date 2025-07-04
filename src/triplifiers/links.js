import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { nameToUri, pathToUri } from '../termMapper/termMapper.js'

function getKnownLinks (links, context) {
  return links.map(link => ({
    ...link,
    ...resolveLink(link, context),
  }))
}

function resolveLink ({ type, value }, context) {
  if (type === 'external') {
    return { uri: rdf.namedNode(value) }
  }

  const { head, selector } = parseHashPath(value)

  // Internal reference: [[#hello]]
  if (!head) {
    const uri = findUriBySelector(context.rootNode, selector) ??
      pathToUri(context.path)
    return {
      uri,
      wikipath: context.path,
      selector,
    }
  }

  // Wiki-link with optional selector: [[path]] or [[path#selector]]
  const resolvedPath = head.startsWith('.')
    ? resolveRelativePath(context.path, head)
    : head

  return {
    uri: nameToUri(resolvedPath),
    wikipath: resolvedPath,
    selector,
  }
}

function findUriBySelector (node, targetSelector) {
  if (node.type === 'block' && node.value === targetSelector && node.uri) {
    return node.uri
  }

  for (const child of node.children ?? []) {
    const found = findUriBySelector(child, targetSelector)
    if (found) return found
  }

  return null
}

function parseHashPath (value) {
  const hashIndex = value.indexOf('#')

  if (hashIndex === -1) {
    return { head: value, selector: undefined }
  }

  return {
    head: hashIndex === 0 ? undefined : value.slice(0, hashIndex),
    selector: value.slice(hashIndex + 1),
  }
}

function resolveRelativePath (currentPath, relativePath) {
  // Get directory from current path
  const lastSlash = currentPath.lastIndexOf('/')
  const baseDir = lastSlash === -1 ? '' : currentPath.slice(0, lastSlash)

  // Normalize path
  const fullPath = baseDir ? `${baseDir}/${relativePath}` : relativePath
  const parts = fullPath.split('/')
  const resolved = []

  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
    } else if (part && part !== '.') {
      resolved.push(part)
    }
  }

  return resolved.join('/')
}

function populateLink (link, context, options) {
  const {
    type, alias, uri, selector,
  } = link

  const { includeLabelsFor } = options
  const { pointer } = context

  if (includeLabelsFor.includes('documents') && alias) {
    pointer.node(uri).addOut(ns.dot.alias, alias)
  }

  if (type === 'external') {
    pointer.addOut(ns.dot.external, uri)
  } else if (type === 'internal') {
    pointer.addOut(ns.dot.related,
      findUriBySelector(context.rootNode, selector) ?? uri)
  } else {
    throw Error(`I don't know how to handle link of type:${type}`)
  }

}

export { getKnownLinks, populateLink }
