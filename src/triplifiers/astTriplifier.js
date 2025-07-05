import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import ns from '../namespaces.js'
import { blockUri } from '../termMapper/termMapper.js'
import { getKnownLinks, populateLink } from './links.js'
import { populateInline, populateYamlLike } from './populateData.js'

function astTriplifier (node, context, options) {
  assignInternalUris(node, context, options)
  return traverseAst(node, { ...context, rootNode: node }, options)
}

function assignInternalUris (node, context, options) {
  for (const child of node.children ?? []) {
    const { childUri } = getNodeUri(child, context, options)
    if (childUri) {
      child.uri = childUri
    }
    assignInternalUris(child, context, options)
  }
}

function traverseAst (node, context, options) {
  const { includeLabelsFor, includeSelectors, includeRaw } = options
  const { pointer, text } = context

  // Add tags
  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  // Process data and links
  const knownLinks = (node.links && node.type !== 'code')
    ? getKnownLinks(node.links, context, options)
    : []

  for (const data of node.data ?? []) {
    const populateFn = Array.isArray(data) ? populateInline : populateYamlLike
    populateFn(data, { ...context, knownLinks }, options)
  }

  knownLinks.filter(link => !link.mapped).
    forEach(link => populateLink(link, context, options))

  // Process children
  let rawStart = null
  let rawPointer = null

  for (const child of node.children ?? []) {
    const { shouldSplit } = getNodeUri(child, context, options)

    if (shouldSplit) {
      // Finalize previous block's raw content
      if (includeRaw && rawStart !== null && rawPointer && child.position &&
        text) {
        const raw = text.substring(rawStart, child.position.start.offset).trim()
        if (raw) rawPointer.addOut(ns.dot.raw, rdf.literal(raw))
      }

      const childPointer = pointer.node(child.uri)

      // Set up block
      childPointer.addOut(ns.rdf.type, ns.dot.Block)
      pointer.addOut(ns.dot.contains, child.uri)

      // Add section label if requested and child has value (header text)
      if (includeLabelsFor.includes('sections') && child.value) {
        childPointer.addOut(ns.rdfs.label, rdf.literal(child.value))
      }

      // Add anchor label if requested and child has identifier
      if (includeLabelsFor.includes('anchors') && child.ids &&
        child.ids.length > 0) {
        childPointer.addOut(ns.rdfs.label, rdf.literal(child.ids[0]))
      }

      if (includeSelectors && child.type === 'block' && child.position) {
        appendPosition(childPointer, child.position)
      }

      // Update raw content tracking
      if (includeRaw && child.position && text) {
        rawStart = child.position.end.offset
        rawPointer = childPointer
      }

      traverseAst(child, { ...context, pointer: childPointer }, options)
    } else {
      traverseAst(child, context, options)
    }
  }

  // Finalize last block's raw content
  if (includeRaw && rawStart !== null && rawPointer && text) {
    const raw = text.substring(rawStart).trim()
    if (raw) rawPointer.addOut(ns.dot.raw, rdf.literal(raw))
  }

  return pointer
}

function appendPosition (node, position) {
  const { start, end } = position
  node.addOut(ns.oa.hasSelector, sel =>
    sel.addOut(ns.rdf.type, ns.oa.TextPositionSelector).
      addOut(ns.oa.start, toRdf(start.offset)).
      addOut(ns.oa.end, toRdf(end.offset)),
  )
}

function getNodeUri (node, context, options) {
  const { pointer } = context

  if (options.partitionBy.includes('identifier') && node.type !== 'root' &&
    node.ids) {
    const [id] = node.ids
    const childUri = pointer.term.termType === 'BlankNode'
      ? rdf.blankNode()
      : blockUri(pointer.term, id)
    return { shouldSplit: true, childUri }
  }

  if (options.partitionBy.includes('tag') && node.type !== 'root' &&
    node.tags) {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  if (options.partitionBy.includes('header') && node.type === 'block') {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  return { shouldSplit: false }
}

export { astTriplifier }
