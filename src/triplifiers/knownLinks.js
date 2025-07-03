import rdf from 'rdf-ext'
import { nameToUri, pathToUri } from '../termMapper/termMapper.js'

function getKnownLinks (links, context, options) {
  return links.map(({ type, value, alias }) => ({
    type, value, alias, ...urisAndPaths({ type, value }, context, options),
  }))
}

function searchUriBySelector (node, selector) {
  function traverse (node) {
    if (node.uri && node.value === selector) {
      return node.uri
    }
    for (const child of node.children ?? []) {
      const result = traverse(child)
      if (result) return result
    }
  }

  return traverse(node)
}

function urisAndPaths ({ type, value }, context) {
  const { rootNode } = context
  if (type === 'external') {
    return { uri: rdf.namedNode(value) }
  }

  const { head, selector } = splitHash(value)

  // [[#hello]]
  if (!head) {
    const maybeUri = searchUriBySelector(rootNode, selector)
    return {
      uri: maybeUri ?? pathToUri(context.path),
      wikipath: context.path,
      selector,
    }
  }

  const resolvedPath = head.startsWith('.') ? resolvePath(
    activePath(context.path), head) : head

  // Wiki-links
  const uri = nameToUri(resolvedPath)

  return {
    uri,
    wikipath: resolvedPath,
    selector,
  }

}

function splitHash (value) {
  const [head, ...tail] = value.split('#')
  return {
    head: head.length ? head : undefined,
    selector: tail.length ? tail.join('#') : undefined,
  }
}

function activePath (path) {
  const split = path.split('/')
  return split.length === 1 ? split[0] : split.slice(0, -1).
    join('/')
}

function resolvePath (activePath, head) {
  if (!activePath) {
    return head
  }

  // Browser-compatible path resolution
  const parts = ['/', activePath, head].join('/').split('/')
  const resolved = []

  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
    } else if (part !== '.' && part !== '') {
      resolved.push(part)
    }
  }

  return resolved.join('/').replace(/^\//, '')
}

export { getKnownLinks }
