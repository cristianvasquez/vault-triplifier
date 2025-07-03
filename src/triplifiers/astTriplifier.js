import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { blockUri } from '../termMapper/termMapper.js'
import { getKnownLinks } from './knownLinks.js'
import { populateInline, populateYamlLike } from './populateData.js'
import { populateLink } from './populateLink.js'

import {
  toRdf,
} from 'rdf-literal'

function astTriplifier (node, context, options) {
  assignInternalUris(node, context, options)
  const pointer = traverseAst(node, { ...context, rootNode: node }, options)
  pointer.addOut(ns.rdf.type, ns.dot.Note)
  return pointer
}

function appendPosition (node, position) {
  const { start, end } = position
  node.addOut(ns.oa.hasSelector,
    positionSelector => positionSelector.addOut(ns.rdf.type,
      ns.oa.TextPositionSelector).
      addOut(ns.oa.start, toRdf(start.offset)).
      addOut(ns.oa.end, toRdf(end.offset)))
}

function assignInternalUris (node, context, options) {
  function traverse (node, context, options) {
    for (const child of node.children ?? []) {
      const { childUri } = handleSplit(child, context, options)
      if (childUri) {
        child.uri = childUri
      }
      traverse(child, context, options)
    }
  }

  traverse(node, context, options)
}

function traverseAst (node, context, options) {

  const { addLabels, includeSelectors } = options
  const { pointer } = context

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
    const { shouldSplit } = handleSplit(child, context, options)

    if (shouldSplit) {

      if (addLabels && child.value) {
        pointer.node(child.uri).addOut(ns.rdfs.label, rdf.literal(child.value))
      }

      if (includeSelectors && child.type === 'block') {
        appendPosition(pointer.node(child.uri), child.position)
      }

      pointer.node(child.uri).addOut(ns.rdf.type, ns.dot.Block)

      pointer.addOut(ns.dot.contains, child.uri)

      traverseAst(child, { ...context, pointer: pointer.node(child.uri) },
        options)
    } else {
      traverseAst(child, context, options)
    }
  }

  return pointer
}

function handleSplit (node, context, options) {
  const { pointer } = context

  if (options.splitOnId && node.type !== 'root' && node.ids) {
    const [id] = node.ids
    const childUri = pointer.term.termType === 'BlankNode'
      ? rdf.blankNode()
      : blockUri(pointer.term, id)
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
