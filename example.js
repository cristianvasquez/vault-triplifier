import { readFile } from 'fs/promises'
import { resolve } from 'path'
import rdf from 'rdf-ext'
import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const dir = './example-vault'

const triplifier = await createTriplifier(dir)

const triplifyOptions = {
  customMappings: {
    // Will map an attribute to a known rdf-property
    'lives in': ns.schema.address,
  },
  // will split the document using the nested headers, creating connected rdf-entities.
  splitOnHeader: true,
  baseNamespace: ns.ex,
  addLabels: true,
  namespaces: ns,
  includeWikipaths: false,
}

const dataset = rdf.dataset()

for (const file of triplifier.getFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file }, triplifyOptions)
  for (const quad of pointer.dataset) {
    dataset.add(quad)
  }
}

console.log(await prettyPrint(dataset, ns))
