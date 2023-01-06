import ns from '../namespaces.js'
import rdf from '../rdf-ext.js'
import { getNameFromPath } from '../strings/uris.js'

const isFile = (x) => x.type === 'file'
const isGroup = (x) => x.type === 'group'

const contains = (node, otherNode) => {
  return (otherNode !== node && otherNode.x >= node.x && otherNode.y >=
    node.y && otherNode.x + otherNode.width <= node.x + node.width &&
    otherNode.y + otherNode.height <= node.y + node.height)
}

function canvasTriplifier (canvas, context, options) {

  const { pointer, termMapper, path } = context

  const { nodes, edges } = canvas
  const nodeMap = new Map()

  // Build URIs
  for (const node of nodes) {
    if (isGroup(node)) {
      const { label } = node

      const {
        resolvedObject,
      } = termMapper.maybeMapped(
        { subject: pointer.term, predicate: undefined, object: label }, context)

      const o = resolvedObject ?? rdf.blankNode()
      if (options.addLabels && o) {
        pointer.node(o).addOut(ns.schema.name, rdf.literal(label))
      }

      nodeMap.set(node.id, o)
    } else if (isFile(node)) {
      const path = node.file
      const o = termMapper.pathToUri(path)
      if (options.addLabels) {
        pointer.node(o).
          addOut(ns.schema.name, rdf.literal(getNameFromPath(path)))
      }
      if (options.includeWikipaths) {
        pointer.node(o).addOut(ns.dot.wikipath, rdf.literal(path))
      }
      nodeMap.set(node.id, o)
    }
  }

  // Add containment
  for (const node of nodes.filter(isGroup)) {
    for (const otherNode of nodes) {
      if (contains(node, otherNode)) {

        const s = nodeMap.get(node.id)
        const p = ns.dot.contains
        const o = nodeMap.get(otherNode.id)

        pointer.node(s).addOut(p, o)
      }
    }
  }

  // Add edges
  for (const edge of edges) {
    const { fromNode, toNode, label } = edge

    const subject = nodeMap.get(fromNode)
    const object = nodeMap.get(toNode)

    const {
      resolvedSubject,
      resolvedPredicate,
      resolvedObject,
    } = termMapper.maybeMapped(
      {
        subject,
        predicate: label,
        object,
      }, context)

    const s = resolvedSubject ?? subject
    const p = resolvedPredicate ??
      termMapper.newProperty(label, options)
    const o = resolvedObject ?? object

    pointer.node(s).addOut(p, o)
  }

  // All the nodes that are not contained somewhere will hang from the canvas itself
  for (const uri of nodeMap.values()) {
    const containers = pointer.node(uri).in(ns.dot.contains).terms
    if (containers.length === 0) {
      pointer.addOut(ns.dot.contains, uri)
    }
  }

  return pointer
}

export { canvasTriplifier }
