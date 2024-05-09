import { TurtleSerializer } from '@rdfjs-elements/formats-pretty'
import getStream from 'get-stream'
import ns from '../../src/namespaces.js'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...prefixes })) {
    result[key] = value().value
  }
  return result
}

async function prettyPrint (dataset) {

  const turtleSink = new TurtleSerializer({
    prefixes: toPlain(ns),
  })
  const stream = await turtleSink.import(dataset.toStream())
  return await getStream(stream)
}

export { prettyPrint }

