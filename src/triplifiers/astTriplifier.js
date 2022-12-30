import rdf from '../rdf-ext.js'

import ns from '../namespaces.js'
import { populateData } from './populateData.js'
import { populateLinks } from './populateLinks.js'

function astTriplifier (node, context, options) {

  const {addLabels} = options
  const { pointer } = context

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
    const { shouldSplit, childUri } = handleSplit(child, context, options)
    if (shouldSplit) {

      if (addLabels && child.value){
        pointer.node(childUri).addOut(ns.schema.name, rdf.literal(child.value))
      }

      pointer.addOut(ns.dot.contains, childUri)
      astTriplifier(child, { ...context, pointer: pointer.node(childUri) },
        options)
    } else {
      astTriplifier(child, context, options)
    }
  }

  return pointer
}

function handleSplit (node, context, options) {
  const { documentUri, termMapper } = context

  if (options.splitOnId && node.type !== 'root' && node.ids) {
    const [id] = node.ids
    const childUri = documentUri === 'BlankNode'
      ? rdf.blankNode()
      : termMapper.blockUri(documentUri, id)
    return { shouldSplit: true, childUri }
  }

  if (options.splitOnTag && node.type !== 'root' && node.tags) {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  if (options.splitOnHeader && node.type === 'block') {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  return {
    shouldSplit: false,
  }
}

export { astTriplifier }
