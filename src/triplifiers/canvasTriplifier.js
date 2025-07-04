import ns from '../namespaces.js'
import rdf from 'rdf-ext'
import { getNameFromPath } from '../strings/uris.js'
import { createMapper } from '../termMapper/customMapper.js'
import { pathToUri, propertyToUri } from '../termMapper/termMapper.js'

const NODE_TYPES = {
  FILE: 'file',
  GROUP: 'group',
  TEXT: 'text',
}

const contains = (parent, child) => {
  return child !== parent &&
    child.x >= parent.x &&
    child.y >= parent.y &&
    child.x + child.width <= parent.x + parent.width &&
    child.y + child.height <= parent.y + parent.height
}

function canvasTriplifier (canvas, context, options) {
  const { pointer } = context
  const mapper = createMapper(options.mappings)
  const { nodes, edges } = canvas
  const nodeMap = new Map()

  // Process nodes by type
  nodes.forEach(node => {
    const uri = createNodeUri(node, pointer, mapper, context, options)
    if (uri) {
      nodeMap.set(node.id, uri)
    }
  })

  // Add containment relationships
  const groupNodes = nodes.filter(n => n.type === NODE_TYPES.GROUP)
  groupNodes.forEach(parent => {
    nodes.filter(child => contains(parent, child)).forEach(child => {
      const parentUri = nodeMap.get(parent.id)
      const childUri = nodeMap.get(child.id)
      if (parentUri && childUri) {
        pointer.node(parentUri).addOut(ns.dot.contains, childUri)
      }
    })
  })

  // Process edges
  edges.forEach(edge => {
    const subject = nodeMap.get(edge.fromNode)
    const object = nodeMap.get(edge.toNode)

    if (!subject || !object) return

    const { resolvedSubject, resolvedPredicate, resolvedObject } = mapper({
      subject,
      predicate: edge.label,
      object,
    }, context)

    const s = resolvedSubject ?? subject
    const p = resolvedPredicate ?? propertyToUri(edge.label)
    const o = resolvedObject ?? object

    pointer.node(s).addOut(p, o)
  })

  // Add uncontained nodes to canvas
  nodeMap.forEach(uri => {
    const hasContainers = pointer.node(uri).in(ns.dot.contains).terms.length > 0
    if (!hasContainers) {
      pointer.addOut(ns.dot.contains, uri)
    }
  })

  return pointer
}

function createNodeUri (node, pointer, mapper, context, options) {
  switch (node.type) {
    case NODE_TYPES.GROUP:
      return createGroupNode(node, pointer, mapper, context, options)
    case NODE_TYPES.FILE:
      return createFileNode(node, pointer, options)
    case NODE_TYPES.TEXT:
      return createTextNode(node, pointer, options)
    default:
      return null
  }
}

function createGroupNode (node, pointer, mapper, context, options) {
  const { resolvedObject } = mapper({
    subject: pointer.term,
    predicate: undefined,
    object: node.label,
  }, context)

  const uri = resolvedObject ?? rdf.blankNode()

  if (options.addLabels && node.label) {
    pointer.node(uri).addOut(ns.rdfs.label, rdf.literal(node.label))
  }

  return uri
}

function createFileNode (node, pointer, options) {
  const uri = pathToUri(node.file)

  if (options.addLabels) {
    const label = getNameFromPath(node.file)
    pointer.node(uri).addOut(ns.rdfs.label, rdf.literal(label))
  }

  return uri
}

function createTextNode (node, pointer, options) {
  const uri = rdf.blankNode()

  if (options.addLabels && node.text) {
    pointer.node(uri).addOut(ns.schema.description, rdf.literal(node.text))
  }

  return uri
}

export { canvasTriplifier }
