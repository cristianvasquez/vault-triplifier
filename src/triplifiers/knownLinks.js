import { resolve } from 'path'
import rdf from '../rdf-ext.js'

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

function urisAndPaths ({ type, value }, context, options) {
  const { termMapper, rootNode } = context
  if (type === 'external') {
    return { uri: rdf.namedNode(value) }
  }

  const { head, selector } = splitHash(value)

  // [[#hello]]
  if (!head) {
    const maybeUri = searchUriBySelector(rootNode, selector)
    return {
      uri: maybeUri ?? termMapper.pathToUri(context.path, options),
      wikipath: context.path,
      selector,
    }
  }

  const resolvedPath = head.startsWith('.') ? resolvePath(
    activePath(context.path), head) : head

  // Wiki-links
  const maybePath = termMapper.getPathByName ? termMapper.getPathByName(
    resolvedPath, activePath(context.path)) : resolvedPath

  return {
    uri: maybePath && maybePath.path ? termMapper.pathToUri(maybePath.path,
      options) : rdf.blankNode(), wikipath: resolvedPath, selector,
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
  return resolve('/', activePath, head).replace(/^\//, '')
}

export { getKnownLinks }
