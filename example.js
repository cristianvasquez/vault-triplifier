import { readFile } from 'fs/promises'
import { resolve } from 'path'
import ns from './src/namespaces.js'

import { createTriplifier } from './index.js'

const dir = './test/markdown/'
// const dir = './incubator/example/'

// Optional function to map strings to URIs
const customMapper = (str) => {
  const values = {
    'is a': ns.rdf.type, 'are': ns.rdf.type, 'ex:knows': ns.ex.knows,
  }
  return values [str]
}

const triplifier = await createTriplifier(dir, {
  baseNamespace: ns.ex, customMapper,
})

for (const file of triplifier.vault.getMarkdownFiles()) {
  console.log('Processing file:', file)
  const text = await readFile(resolve(dir, file), 'utf8')
  const pointer = triplifier.toRdf(text, { path: file }, { addLabels: true, includeWikiPaths:true })
  console.log(pointer.dataset.toString())
}
