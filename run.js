import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { buildIndex } from './src/indexers/buildIndex.js'
import ns from './src/namespaces.js'
import { toRdf } from './src/toRdf.js'
import {
  createTermMapper,
} from './src/termMapper/defaultUriResolver.js'

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

for (const file of index.files.filter(x=>x.endsWith('.md'))) {
  console.log('Processing file:', file)
  const text = await content(resolve(dir, file))
  const termMapper = createTermMapper({ index, mappers, baseNamespace: vault })
  const pointer = toRdf(text, { termMapper, path:file })
  console.log(pointer.dataset.toString())
}
