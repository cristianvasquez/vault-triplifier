import { readFile } from 'fs/promises'
import { glob } from 'glob'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { canvasToRDF } from './src/canvas-to-RDF.js'

import { markdownToRDF } from './src/markdown-to-RDF.js'
import { postProcess } from './src/postProcess.js'
import { createPathResolver } from './src/pathResolver.js'
import { MarkdownTriplifierOptions } from './src/schemas.js'
import { getNameFromPath } from './src/strings/uris.js'
import { nameToUri } from './src/termMapper/termMapper.js'
import ns from './src/namespaces.js'

async function triplifyVault (dir, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  const { getPathByName } = await createPathResolver(dir)
  const dataset = rdf.dataset()

  const files = await glob('**/+(*.md|*.canvas)', { cwd: dir, absolute: true })

  for (const file of files) {
    const document = await triplifyFile(file, parsedOptions)
    const result = postProcess({ pointer: document, getPathByName }, parsedOptions)
    dataset.addAll(result.dataset)
  }

  return dataset
}

async function triplifyFile (file, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  
  const name = getNameFromPath(file)
  const term = nameToUri(name)
  const text = await readFile(file, 'utf8')
  const pointer = grapoi({ dataset: rdf.dataset(), factory: rdf, term }).
    addOut(ns.prov.atLocation, rdf.namedNode(`file://${file}`))
  
  // Add document label if requested
  if (parsedOptions.includeLabelsFor.includes('documents')) {
    pointer.addOut(ns.rdfs.label, rdf.literal(name))
  }

  if (file.endsWith('.md')) {
    return markdownToRDF(text, { pointer, path: file }, parsedOptions)
  } else if (file.endsWith('.canvas')) {
    return canvasToRDF(text, { pointer, path: file }, parsedOptions)
  } else throw Error(`Only .md and .canvas are supported.`)
}

export { triplifyVault, triplifyFile }
