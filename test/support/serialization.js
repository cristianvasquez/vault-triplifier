import { turtle } from '@rdfjs-elements/formats-pretty/serializers'
import ns from '../../src/namespaces.js'
import getStream from 'get-stream'
import { Readable } from 'readable-stream'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...prefixes })) {
    result[key] = value().value
  }
  return result
}

function readableFrom (iterable) {
  let reading = false
  const iterator = iterable[Symbol.iterator]()

  const next = () => {
    try {
      const { value, done } = iterator.next()

      if (done) {
        readable.push(null)
      } else if (readable.push(value)) {
        next()
      } else {
        reading = false
      }
    } catch (err) {
      readable.destroy(err)
    }
  }

  const readable = new Readable({
    objectMode: true, read: () => {
      if (!reading) {
        reading = true
        next()
      }
    },
  })

  return readable
}

async function prettyPrint (dataset, prefixes = ns) {
  const sink = await turtle({
    prefixes: toPlain(prefixes),
  })

  const stream = await sink.import(readableFrom(dataset))
  return await getStream(stream)
}

export { prettyPrint }

