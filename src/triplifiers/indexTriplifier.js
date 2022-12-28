import rdf from 'rdf-ext'
import ns from '../namespaces.js'

function getParent (url) {
  return url.split('/').splice(0, url.split('/').length - 1).join('/')
}

function getName (url) {
  return url.split('/').splice(url.split('/').length - 1)[0]
}

function triplifyIndex (index, { termMapper }) {
  const { files, directories } = index
  const dataset = rdf.dataset()

  for (const path of files) {
    const container = getParent(path)
    const containerUri = container === '.' ? ns.dot.root : termMapper.fromPath(
      container)
    const fileUri = termMapper.fromPath(path)
    dataset.add(rdf.quad(containerUri, ns.dot.contains, fileUri, ns.dot.index))
    dataset.add(rdf.quad(fileUri, ns.schema.name, rdf.literal(getName(path)),
      ns.dot.index))
    dataset.add(rdf.quad(fileUri, ns.dot.path, rdf.literal(path), fileUri))
  }

  for (const path of directories) {
    const parent = getParent(path)
    const parentUri = parent === '.' ? ns.dot.root : termMapper.fromPath(parent)
    const containerUri = termMapper.fromPath(path)
    dataset.add(
      rdf.quad(parentUri, ns.dot.contains, containerUri, ns.dot.index))
    dataset.add(
      rdf.quad(containerUri, ns.schema.name, rdf.literal(getName(path)),
        ns.dot.index))
    dataset.add(
      rdf.quad(containerUri, ns.rdf.type, ns.dot.Folder, ns.dot.index))
  }

  dataset.add(rdf.quad(ns.dot.root, ns.rdf.type, ns.dot.Folder, ns.dot.index))
  dataset.add(
    rdf.quad(ns.dot.root, ns.schema.name, rdf.literal('Root'), ns.dot.index))

  return rdf.clownface({ dataset, term: ns.dot.root })
}

export { triplifyIndex }
