import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'

const dir = './test/markdown/'

const triplifierOptions = {
  baseNamespace: ns.ex,
  namespaces: ns,
  addLabels: true,
  includeWikipaths: true,
  splitOnHeader: true,
}

const triplifier = await createTriplifier(dir)

for (const file of triplifier.vault.getFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRDF(text, { path: file }, triplifierOptions)
  console.log(pointer.dataset.toString())
}

