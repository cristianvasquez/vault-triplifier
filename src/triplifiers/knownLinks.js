import rdf from 'rdf-ext'
import { nameToUri, pathToUri } from '../termMapper/termMapper.js'

function getKnownLinks(links, context, options) {
  return links.map(link => ({
    ...link,
    ...resolveLink(link, context, options)
  }))
}

function resolveLink({ type, value }, context) {
  if (type === 'external') {
    return { uri: rdf.namedNode(value) }
  }

  const { head, selector } = parseHashPath(value)

  // Internal reference: [[#hello]]
  if (!head) {
    const uri = findUriBySelector(context.rootNode, selector) ?? pathToUri(context.path)
    return {
      uri,
      wikipath: context.path,
      selector
    }
  }

  // Wiki-link with optional selector: [[path]] or [[path#selector]]
  const resolvedPath = head.startsWith('.')
    ? resolveRelativePath(context.path, head)
    : head

  return {
    uri: nameToUri(resolvedPath),
    wikipath: resolvedPath,
    selector
  }
}

function findUriBySelector(node, targetSelector) {
  if (node.uri && node.value === targetSelector) {
    return node.uri
  }

  for (const child of node.children ?? []) {
    const found = findUriBySelector(child, targetSelector)
    if (found) return found
  }

  return null
}

function parseHashPath(value) {
  const hashIndex = value.indexOf('#')

  if (hashIndex === -1) {
    return { head: value, selector: undefined }
  }

  return {
    head: hashIndex === 0 ? undefined : value.slice(0, hashIndex),
    selector: value.slice(hashIndex + 1)
  }
}

function resolveRelativePath(currentPath, relativePath) {
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

export { getKnownLinks }
