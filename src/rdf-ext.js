import clownface from 'clownface'
import rdf from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import namespace from '@rdfjs/namespace'
import TermSet from '@rdfjs/term-set'
import TermMap from '@rdfjs/term-map'
import toNT from '@rdfjs/to-ntriples'

rdf.dataset = (arg) => {
  const dataset = datasetFactory.dataset(arg)
  dataset.toString = () => toNT(dataset)
  return dataset
}
rdf.clownface = (arg) => clownface(arg)
rdf.namespace = (arg) => namespace(arg)
rdf.termSet = (arg) => new TermSet(arg)
rdf.termMap = (arg) => new TermMap(arg)

export default rdf
