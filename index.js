import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { resolve } from 'path'
import rdf from 'rdf-ext'
import { createPathResolver } from './src/pathResolver.js'
import { postProcess } from './src/postProcess.js'
import { toRDF } from './src/toRDF.js'

async function triplifyVault (dir, options) {

  const { getPathByName } = createPathResolver(dir)
  const dataset = rdf.dataset()
  const files = await glob('./**/+(*.md|*.png|*.jpg|*.svg|*.canvas)', {
    cwd: dir,
    nodir: true,
  })
  for (const file of files) {
    console.log('Processing file:', file)
    const text = await readFile(resolve(dir, file), 'utf8')
    const pointer = toRDF(text,
      { path: file }, options)
    const result = postProcess({ pointer, getPathByName },
      options)

    for (const quad of result.dataset) {
      dataset.add(quad)
    }
  }
  return dataset

}

export { triplifyVault }

