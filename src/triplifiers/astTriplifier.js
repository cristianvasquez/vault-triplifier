import rdf from 'rdf-ext'
import { toRdf } from 'rdf-literal'
import ns from '../namespaces.js'
import { blockUri, fileUri } from '../termMapper/termMapper.js'
import { getKnownLinks, populateLink } from './links.js'
import { populateInline, populateYamlLike } from './populateData.js'

// State to track previous selector for end position updates
let previousSelectorData = null

function astTriplifier (node, context, options) {
  // Reset selector tracking for each document
  previousSelectorData = null
  
  assignInternalUris(node, context, options)
  const result = traverseAst(node, { ...context, rootNode: node }, options)
  
  // Finalize the last selector if it exists
  if (previousSelectorData && context.text) {
    finalizeFinalSelector(context.text.length)
  }
  
  return result
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
  const { includeLabelsFor, includeSelectors } = options
  const { pointer, path} = context

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

  for (const child of node.children ?? []) {
    const { shouldSplit } = getNodeUri(child, context, options)

    if (shouldSplit) {

      const childPointer = pointer.node(child.uri)

      // Set up block
      childPointer.addOut(ns.rdf.type, ns.oa.Annotation)
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
        const documentTerm = fileUri(path)
        appendPosition(childPointer, documentTerm, child.position)
      }

      traverseAst(child, { ...context, pointer: childPointer }, options)
    } else {
      traverseAst(child, context, options)
    }
  }

  return pointer
}

function appendPosition (node, documentTerm, position) {
  const { start } = position

  // Update previous selector's end position to current start
  if (previousSelectorData) {
    updatePreviousSelectorEnd(start.offset)
  }

  // Create selector with start position (end will be updated later)
  let selectorPointer = null
  node
    .addOut(ns.oa.hasSource, documentTerm)
    .addOut(ns.oa.hasSelector, sel => {
      selectorPointer = sel
      return sel.addOut(ns.rdf.type, ns.oa.TextPositionSelector)
        .addOut(ns.oa.start, toRdf(start.offset))
        .addOut(ns.oa.end, toRdf(start.offset)) // Temporary end, will be updated
    })

  // Store current selector data for future end position update
  previousSelectorData = {
    selectorPointer,
    startOffset: start.offset
  }
}

function updatePreviousSelectorEnd(newEndOffset) {
  if (previousSelectorData) {
    // Remove old end and add new end
    const { selectorPointer } = previousSelectorData
    // Find and update the end triple
    for (const quad of selectorPointer.dataset) {
      if (quad.subject.equals(selectorPointer.term) && 
          quad.predicate.equals(ns.oa.end)) {
        selectorPointer.dataset.delete(quad)
        break
      }
    }
    selectorPointer.addOut(ns.oa.end, toRdf(newEndOffset))
  }
}

function finalizeFinalSelector(documentEndOffset) {
  if (previousSelectorData) {
    updatePreviousSelectorEnd(documentEndOffset)
    previousSelectorData = null
  }
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

  if (options.partitionBy.includes('headers-all') && node.type === 'block') {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  if (options.partitionBy.includes('headers-h1-h2') && node.type === 'block' && 
      node.depth && (node.depth === 1 || node.depth === 2)) {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  if (options.partitionBy.includes('headers-h1-h2-h3') && node.type === 'block' && 
      node.depth && (node.depth === 1 || node.depth === 2 || node.depth === 3)) {
    return { shouldSplit: true, childUri: rdf.blankNode() }
  }

  return { shouldSplit: false }
}

export { astTriplifier }
