import rdf from 'rdf-ext'
import ns from '../namespaces.js'

function getParent (url) {
  return url.split('/').splice(0, url.split('/').length - 1).join('/')
}

function getName (url) {
  return url.split('/').splice(url.split('/').length - 1)[0]
}

function triplifyIndex ({ index, uriResolver }) {
  const { files, directories } = index
  const result = rdf.dataset()

  for (const path of files) {
    const container = getParent(path)
    const containerUri = container === '.'
      ? ns.dot.root
      : uriResolver.getUriFromPath(container)
    const fileUri = uriResolver.getUriFromPath(path)
    result.add(rdf.quad(containerUri, ns.dot.contains, fileUri, ns.dot.index))
    result.add(rdf.quad(fileUri, ns.schema.name, rdf.literal(getName(path)), ns.dot.index))
    result.add(rdf.quad(fileUri, ns.dot.path, rdf.literal(path), fileUri))
  }

  for (const path of directories) {
    const parent = getParent(path)
    const parentUri = parent === '.' ? ns.dot.root :uriResolver.getUriFromPath(parent)
    const containerUri = uriResolver.getUriFromPath(path)
    result.add(rdf.quad(parentUri, ns.dot.contains, containerUri, ns.dot.index))
    result.add(rdf.quad(containerUri, ns.schema.name, rdf.literal(getName(path)), ns.dot.index))
    result.add(rdf.quad(containerUri, ns.rdf.type, ns.dot.Folder, ns.dot.index))
  }

  result.add(rdf.quad(ns.dot.root, ns.rdf.type, ns.dot.Folder, ns.dot.index))
  result.add(rdf.quad(ns.dot.root, ns.schema.name, rdf.literal("Root"), ns.dot.index))

  return result
}

export { triplifyIndex }
