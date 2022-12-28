import { turtle } from '@rdfjs-elements/formats-pretty/serializers'
import ns from '../../src/namespaces.js'
import getStream from 'get-stream'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...ns, ...prefixes })) {
    result[key] = value().value
  }
  return result
}

async function prettyPrint (dataset, prefixes = {}) {
  const sink = await turtle({
    prefixes: toPlain(prefixes),
  })
  const stream = await sink.import(dataset.toStream())
  return await getStream(stream)
}

export { prettyPrint }

