import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { buildIndex } from './src/indexers/buildIndex.js'
import ns from './src/namespaces.js'
import { toRdf } from './src/toRdf.js'
import {
  createTermMapper,
} from './src/termMapper/defaultUriResolver.js'
import { triplifyIndex } from './src/triplifiers/indexTriplifier.js'

const dir = './test/markdown/'

// Config
const vault = ns.ex
const mappers = {
  'is a': ns.rdf.type, 'are': ns.rdf.type, 'ex:knows': ns.ex.knows,
}

const index = await buildIndex(dir)

async function content (path) {
  return await readFile(path, 'utf8')
}

const termMapper = createTermMapper({ index, mappers, baseNamespace: vault })

// const ptr = triplifyIndex(index, {termMapper})
// console.log(ptr.dataset.toString())

for (const file of index.files.filter(x => x.endsWith('.md'))) {
  if (file.endsWith('Details.md')){
    console.log('Processing file:', file)
    const text = await content(resolve(dir, file))
    const pointer = toRdf(text, { termMapper, path: file })
    console.log(pointer.dataset.toString())
  }

}
