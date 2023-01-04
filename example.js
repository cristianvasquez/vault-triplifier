import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { createTriplifier } from './index.js'
import ns from './src/namespaces.js'
import { customMapper } from './src/termMapper/defaultCustomMapper.js'

const dir = './test/markdown/'

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

