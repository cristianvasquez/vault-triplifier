import ns from '../namespaces.js'
import rdf from 'rdf-ext'

function populateLink (link, context, options) {
  const {
    type, value, alias, uri, wikipath, selector,
  } = link

  const { addLabels, includeSelectors } = options
  const { pointer } = context

  if (addLabels && alias) {
    pointer.node(uri).addOut(ns.dot.alias, alias)
  }

  if (type === 'external') {
    pointer.addOut(ns.dot.external, uri)
  } else if (type === 'internal') {
    pointer.addOut(ns.dot.related, uri)
  } else {
    throw Error(`I don't know how to handle link of type:${type}`)
  }

  if (selector && includeSelectors) {
    // [[OtherNote#SomeSection]] : selector -> SomeSection
    pointer.node(uri).addOut(ns.dot.selector, rdf.literal(selector))
  }

}

export { populateLink }
