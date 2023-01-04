import ns from '../namespaces.js'

const customMapper = (str, context) => {
  // It's of the form schema::name
  if (str.split(':').length === 2) {
    const [vocabulary, property] = str.split(':')
    return ns[vocabulary] ? ns[vocabulary][property] : undefined
  }

  const values = {
    'is a': ns.rdf.type,
  }
  return values [str]
}
export { customMapper }
