import { resolve } from 'path'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { populatePointer } from './handleData.js'
import { isValidUrl } from './strings.js'

function shouldSplit (node, options) {
  if (options.splitOnTag && node.type !== 'root' && node.tags) {
    return true
  }
}

function astTriplifier (node, context, options) {

  const { pointer, termMapper, path } = context

  for (const data of node.data ?? []) {
    populatePointer(data, { pointer, termMapper }, options)
  }

  for (const tag of node.tags ?? []) {
    pointer.addOut(ns.dot.tag, rdf.literal(tag))
  }

  for (const { type, value, alias } of node.links ?? []) {
    function getNamed (txt) {
      if (isValidUrl(txt)) {
        return rdf.namedNode(txt)
      } else if (type === 'wikiLink') {
        return termMapper.toNamed(`[[${txt}]]`)
      }
      const resolved = `.${resolve('/',path, txt)}`
      return termMapper.fromPath(resolved)
    }

    if (!value) {
      throw Error(JSON.stringify(node, null, 2))
    }
    const named = getNamed(value)
    if (pointer.dataset.match(pointer.term, null, named).size === 0) {
      pointer.addOut(ns.dot.related, named)
    }
  }

  for (const child of node.children ?? []) {
    if (shouldSplit(child, options)) {
      const uri = rdf.blankNode()
      pointer.addOut(ns.dot.contains, uri)
      astTriplifier(child, { ...context, pointer: pointer.node(uri) }, options)
    } else {
      astTriplifier(child, context, options)
    }
  }

  return pointer
}

export { astTriplifier }
