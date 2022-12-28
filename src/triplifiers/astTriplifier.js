import { resolve } from 'path'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { populateData } from './populateData.js'
import { isValidUrl } from './strings.js'
import { populateLinks } from './populateLinks.js'

function shouldSplit (node, context, options) {
  const { pointer, termMapper, path } = context

  if (options.splitOnTag && node.type !== 'root' && node.tags) {
    return true
  }
  if (options.splitOnId && node.type !== 'root' && node.ids) {
    return true
  }
}

function astTriplifier (node, context, options) {

  const { pointer, termMapper, path } = context

  for (const data of node.data ?? []) {
    populateData(data, context, options)
  }

  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  if (node.links) {
    populateLinks(node.links, context, options)
  }

  for (const child of node.children ?? []) {
    if (shouldSplit(child, context, options)) {
      const uri = rdf.blankNode()
      pointer.addOut(ns.dot.contains, uri)
      astTriplifier(child, { ...context, pointer: pointer.node(uri) }, options)
    } else {
      astTriplifier(child, context, options)
    }
  }

  return pointer
}

export { astTriplifier }
