import { resolve } from 'path'
import ns from '../namespaces.js'
import rdf from '../rdf-ext.js'
import { isValidUrl } from './strings.js'

function populateLinks (links, context, options) {

  const { addLabels } = options
  const { pointer, termMapper, path } = context

  for (const { type, value, alias } of links) {

    function getNamed (txt) {
      if (isValidUrl(txt)) {
        // Normal URL
        return rdf.namedNode(txt)
      } else if (type === 'wikiLink') {
        // Wikilinks
        return termMapper.toNamed(`[[${txt}]]`)
      }
      // Relative links
      const resolved = path ? `.${resolve('/', path, txt)}` : txt
      return termMapper.fromPath(resolved)
    }

    const named = getNamed(value)

    if (alias && addLabels) {
      pointer.node(named).addOut(ns.schema.name, alias)
    }

    if (named.termType === 'BlankNode') {
      if (addLabels){
        pointer.node(named).addOut(ns.schema.name, value)
      }
      // pointer.node(named).addOut(ns.rdf.type, ns.dot.Wikilink)
    }

    if (pointer.dataset.match(pointer.term, null, named).size === 0) {
      pointer.addOut(ns.dot.related, named)
    }
  }
}

export { populateLinks }
