import { readFile } from 'fs/promises'
import { resolve } from 'path'
import rdf from './src/rdf-ext.js'
import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const dir = './example-vault'

const triplifier = await createTriplifier(dir)

const triplifyOptions = {
  baseNamespace: ns.ex,
  addLabels: true,
  includeWikipaths: false,
  splitOnHeader: true,
  namespaces: ns,
  customMappings:{
    'lives in': ns.schema.address
  }

}

const dataset = rdf.dataset()

for (const file of triplifier.getFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file }, triplifyOptions)
  for (const quad of pointer.dataset){
    dataset.add(quad)
  }
}

console.log(await prettyPrint(dataset, ns))
