import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { resolve, normalize } from 'path'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { canvasToRDF } from './src/canvas-to-RDF.js'
import { toRdf } from 'rdf-literal'

import { markdownToRDF } from './src/markdown-to-RDF.js'
import { postProcess } from './src/postProcess.js'
import { createPathResolver } from './src/pathResolver.js'
import { MarkdownTriplifierOptions } from './src/schemas.js'
import { getNameFromPath } from './src/strings/uris.js'
import { nameToUri, pathToUri } from './src/termMapper/termMapper.js'
import ns from './src/namespaces.js'

async function triplifyVault (dir, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)
  const { getPathByName } = await createPathResolver(dir)
  const dataset = rdf.dataset()

  const files = await glob('**/+(*.md|*.canvas)', { cwd: dir, absolute: true })

  for (const file of files) {
    const document = await triplifyFile(file, parsedOptions)
    const result = postProcess({ pointer: document, getPathByName },
      parsedOptions)
    dataset.addAll(result.dataset)
  }

  return dataset
}

async function triplifyFile (file, options) {
  const parsedOptions = MarkdownTriplifierOptions.parse(options)

  const documentUri = rdf.namedNode(`file://${resolve(file)}`)
  const name = getNameFromPath(file)
  const term = nameToUri(name)

  const pointer = grapoi(
    { dataset: rdf.dataset(), factory: rdf, term })

  pointer.addOut(ns.rdf.type, ns.dot.NamedNote).
    addOut(ns.dot.hasRepresentation, documentUri)

  pointer.node(documentUri).
    addOut(ns.dot.represents, term).
    addOut(ns.prov.atLocation, documentUri).
    addOut(ns.prov.generatedAtTime, toRdf(new Date()))

  const text = await readFile(file, 'utf8')

  // Add document label if requested
  if (parsedOptions.includeLabelsFor.includes('documents')) {
    pointer.addOut(ns.rdfs.label, rdf.literal(name))
  }

  if (file.endsWith('.md')) {
    pointer.node(documentUri).addOut(ns.rdf.type, ns.dot.MarkdownDocument)
    return markdownToRDF(text, { pointer, path: file }, parsedOptions)
  } else if (file.endsWith('.canvas')) {
    pointer.node(documentUri).addOut(ns.rdf.type, ns.dot.CanvasDocument)
    return canvasToRDF(text, { pointer, path: file }, parsedOptions)
  } else throw Error(`Only .md and .canvas are supported.`)
}

export { triplifyVault, triplifyFile }
