import { readFile } from 'fs/promises'
import { resolve } from 'path'
import ns from './src/namespaces.js'

import { createTriplifier } from './index.js'

const dir = './test/markdown/'
// const dir = './incubator/example/'

// Config
const triplifier = await createTriplifier(dir, {
  baseNamespace: ns.ex, mapper: {
    'is a': ns.rdf.type, 'are': ns.rdf.type, 'ex:knows': ns.ex.knows,
  },
})

for (const file of triplifier.index.files.filter(x => x.endsWith('.md'))) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRdf(text, { path: file }, { addLabels: true })

  console.log(pointer.dataset.toString())
}
