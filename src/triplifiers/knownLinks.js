import { resolve } from 'path'
import rdf from '../rdf-ext.js'

function getKnownLinks (links, context) {
  return links.map(({ type, value, alias }) => ({
    type, value, alias, ...populateLink({ type, value }, context),
  }))
}

function populateLink ({ type, value }, context) {
  const { termMapper } = context
  if (type === 'external') {
    return { uri: rdf.namedNode(value) }
  }

  const { head, selector } = getSplit(value)

  // [[#hello]]
  if (!head) {
    return {
      uri: termMapper.pathToUri(context.path),
      wikipath: context.path,
      selector,
    }
  }

  const resolvedPath = head.startsWith('.')
    ? resolvePath(activePath(context.path), head)
    : head

  // Wiki-links
  const maybePath = termMapper.getPathByName
    ? termMapper.getPathByName(resolvedPath, activePath(context.path))
    : resolvedPath

  return {
    uri: maybePath && maybePath.path
      ? termMapper.pathToUri(maybePath.path)
      : rdf.blankNode(),
    wikipath: resolvedPath,
    selector,
  }

}

function getSplit (value) {
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
