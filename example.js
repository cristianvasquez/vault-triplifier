import { readFile } from 'fs/promises'
import { resolve } from 'path'
import ns from './src/namespaces.js'

import { createTriplifier } from './index.js'

const dir = './test/markdown/'

// Optional function to map strings to URIs
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

const triplifier = await createTriplifier(dir, {
  baseNamespace: ns.ex, customMapper,
})

for (const file of triplifier.vault.getCanvasFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file },
    { addLabels: true, includeWikipaths: true, splitOnHeader: true })
  console.log(pointer.dataset.toString())
}

