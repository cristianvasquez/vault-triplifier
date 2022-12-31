import rdf from '../rdf-ext.js'
import ns from '../namespaces.js'
import { getKnownLinks } from './knownLinks.js'
import { populateInline, populateYamlLike } from './populateData.js'

function astTriplifier (node, context, options) {

  const { addLabels } = options
  const { pointer } = context

  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  const knownLinks = node.links ? getKnownLinks(node.links, context) : []

  for (const data of node.data ?? []) {
    if (Array.isArray(data)) {
      populateInline(data, { ...context, knownLinks }, options)
    } else {
      populateYamlLike(data, { ...context, knownLinks }, options)
    }
  }

  for (const { named, alias, value } of knownLinks.filter(
    link => !link.mapped)) {
    pointer.addOut(ns.dot.related, named)
    if (addLabels) {
      if (alias) {
        pointer.node(named).addOut(ns.schema.name, alias)
      } else if (named.termType === 'BlankNode') {
        pointer.node(named).addOut(ns.schema.name, value)
      }
    }
  }

  for (const child of node.children ?? []) {
    const { shouldSplit, childUri } = handleSplit(child, context, options)
    if (shouldSplit) {
      if (addLabels && child.value) {
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
