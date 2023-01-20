import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'

const dir = './test/markdown/'

const triplifier = await createTriplifier(dir)

const triplifyOptions = {
  baseNamespace: ns.ex,
  addLabels: true,
  includeWikipaths: true,
  splitOnHeader: true,
}

for (const file of triplifier.getFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file }, triplifyOptions)
  console.log(pointer.dataset.toString())
}

