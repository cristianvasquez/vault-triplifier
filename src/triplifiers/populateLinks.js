import { resolve } from 'path'
import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { isValidUrl } from './strings.js'

function populateLinks (links, context, options) {

  const { pointer, termMapper, path } = context

  for (const { type, value, alias } of links) {

    function getNamed (txt) {
      if (isValidUrl(txt)) {

        const named = rdf.namedNode(txt)
        if (alias) {
          pointer.node(named).addOut(ns.schema.name, alias)
        }
        return named
      } else if (type === 'wikiLink') {
        return termMapper.toNamed(`[[${txt}]]`)
      }
      const resolved = path ? `.${resolve('/', path, txt)}` : txt
      return termMapper.fromPath(resolved)
    }

    const named = getNamed(value)

    if (named.termType === 'BlankNode') {
      pointer.node(named).addOut(ns.schema.name, value)
      pointer.node(named).addOut(ns.rdf.type, ns.dot.Wikilink)
    }

    if (pointer.dataset.match(pointer.term, null, named).size === 0) {
      pointer.addOut(ns.dot.related, named)
    }
  }
}

export { populateLinks }
