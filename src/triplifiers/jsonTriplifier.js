import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { populatePointer } from './handleData.js'

function astTriplifier (node, context, options) {

  const { pointer, uriResolver } = context
  if (!pointer) {
    throw Error('requires pointer')
  }
  if (!uriResolver) {
    throw Error('requires uriResolver')
  }

  for (const { type, value, alias } of node.links ?? []) {
    if (type === 'wikiLink') {
      pointer.addOut(ns.dot.related, uriResolver.getUriFromPath(value))
    } else if (type === 'link') {
      pointer.addOut(ns.dot.related, rdf.namedNode(value))
    }
  }

  for (const data of node.data ?? []) {
    populatePointer(data, { pointer, uriResolver }, options)
  }

  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  for (const child of node.children ?? []) {
    astTriplifier(child, { pointer, uriResolver }, options)
  }

  return pointer
}

export { astTriplifier }
