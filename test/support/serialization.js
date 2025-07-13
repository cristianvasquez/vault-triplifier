import Serializer from '@rdfjs/serializer-turtle'

function toPlain (prefixes) {
  const result = []
  for (const [key, value] of Object.entries({ ...prefixes })) {
    result.push([key, value()])
  }
  return result
}

async function prettyPrint (dataset, namespaces) {
  const serializer = new Serializer({
    prefixes: toPlain(namespaces)
    ,
  })
  return serializer.transform(dataset)
}

export { prettyPrint }

