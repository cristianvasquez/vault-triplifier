import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const dir = './example-vault'

const triplifier = await createTriplifier(dir)

const triplifyOptions = {
  baseNamespace: ns.ex,
  addLabels: true,
  includeWikipaths: true,
  splitOnHeader: true,
  namespaces: ns,
  customMappings:{
    'lives in': ns.schema.address
  }

}


for (const file of triplifier.getFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file }, triplifyOptions)
  console.log(await prettyPrint(pointer.dataset, ns))
}

