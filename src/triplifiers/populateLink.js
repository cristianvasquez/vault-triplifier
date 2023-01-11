import ns from '../namespaces.js'
import rdf from '../rdf-ext.js'

function populateLink (link, context, options) {
  const {
    type, value, alias, uri, wikipath, selector,
  } = link

  const { addLabels, includeWikipaths, includeSelectors } = options
  const { pointer } = context

  if (addLabels && alias) {
    pointer.node(uri).addOut(ns.schema.name, alias)
  }

  if (type === 'external') {
    pointer.addOut(ns.dot.external, uri)
  } else if (type === 'internal') {
    pointer.addOut(ns.dot.related, uri)
  } else {
    throw Error(`I don't know how to handle link of type:${type}`)
  }

  if (wikipath && includeWikipaths) {
    pointer.node(uri).addOut(ns.dot.wikipath, rdf.literal(wikipath))
  }

  if (selector && includeSelectors) {
    pointer.node(uri).addOut(ns.dot.selector, rdf.literal(selector))
  }

}

export { populateLink }
