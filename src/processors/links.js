import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import {
  nameToUri,
  appendSelector,
} from '../termMapper/termMapper.js'
import { getNameFromPath } from '../utils/uris.js'

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
  // Wiki-links [[head]], [[#selector]] or [[head#selector]]
  const { head, selector } = parseHashPath(value)

  // Internal reference: [[#hello]]
  if (!head) {
    const name = getNameFromPath(context.path)
    const nameTerm = nameToUri(name)
    const uri = appendSelector(nameTerm, selector)
    return {
      uri,
      wikipath: context.path,
      selector,
    }
  }

  // [[head]] or [[head#selector]]
  const resolvedHead = head.startsWith('.')
    ? resolveRelativePath(context.path, head)
    : head

  const nameTerm = nameToUri(resolvedHead)
  const uri = selector ? appendSelector(nameTerm, selector) : nameTerm

  return {
    uri,
    wikipath: resolvedHead,
    selector,
  }
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
  pointer.addOut(ns.dot.external, uri)

}

export { getKnownLinks, populateLink }
