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
      const uri = rdf.blankNode()
      if (options.addLabels) {
        pointer.node(uri).addOut(ns.schema.name, rdf.literal(node.label))
      }
      nodeMap.set(node.id, uri)
    } else if (isFile(node)) {
      const path = node.file
      const uri = termMapper.pathToUri(path)
      if (options.addLabels) {
        pointer.node(uri).
          addOut(ns.schema.name, rdf.literal(getNameFromPath(path)))
      }
      if (options.includeWikiPaths) {
        pointer.node(uri).addOut(ns.dot.wikiPath, rdf.literal(path))
      }
      nodeMap.set(node.id, uri)
    }
  }

  // Handle containment
  for (const node of nodes.filter(isGroup)) {
    for (const otherNode of nodes) {
      if (contains(node, otherNode)) {
        pointer.node(nodeMap.get(node.id)).
          addOut(ns.dot.contains, nodeMap.get(otherNode.id))
      }
    }
  }

  // Add edges
  for (const edge of edges) {
    const { fromNode, toNode, label } = edge
    const s = nodeMap.get(fromNode.id)
    const p = termMapper.maybeMapped(label) ??
      termMapper.newProperty(label, options)
    const o = nodeMap.get(toNode.id)
    pointer.node(s).out(p, o)
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
