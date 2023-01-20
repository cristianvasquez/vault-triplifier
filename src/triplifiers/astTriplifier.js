import ns from '../namespaces.js'
import rdf from '../rdf-ext.js'
import { getKnownLinks } from './knownLinks.js'
import { populateInline, populateYamlLike } from './populateData.js'
import { populateLink } from './populateLink.js'

function astTriplifier (node, context, options) {

  const { addLabels, includeWikipaths, includeSelectors } = options
  const { pointer, path } = context

  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  const knownLinks = (node.links && node.type !== 'code') ? getKnownLinks(
    node.links, context, options) : []

  for (const data of node.data ?? []) {
    if (Array.isArray(data)) {
      populateInline(data, { ...context, knownLinks }, options)
    } else {
      populateYamlLike(data, { ...context, knownLinks }, options)
    }
  }

  knownLinks.filter(link => !link.mapped).
    forEach(link => populateLink(link, context, options))

  for (const child of node.children ?? []) {
    const { shouldSplit, childUri } = handleSplit(child, context, options)

    if (shouldSplit) {

      if (addLabels && child.value) {
        pointer.node(childUri).addOut(ns.schema.name, rdf.literal(child.value))
      }

      if (includeWikipaths && path && child.type === 'block') {
        pointer.node(childUri).
          addOut(ns.dot.wikipath, rdf.literal(path))
      }

      if (includeSelectors && child.type === 'block') {
        pointer.node(childUri).
          addOut(ns.dot.selector, rdf.literal(child.value))
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
  const { pointer, termMapper } = context

  if (options.splitOnId && node.type !== 'root' && node.ids) {
    const [id] = node.ids
    const childUri = pointer.term.termType === 'BlankNode'
      ? rdf.blankNode()
      : termMapper.blockUri(pointer.term, id)
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
