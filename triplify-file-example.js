import { resolve } from 'path'
import { triplifyFile } from './node/file-reader.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
// will partition the document into blocks when it encounters headings
  partitionBy: ['headers-h1-h2'],
  // Include labels for documents, sections and properties (great for querying)
  includeLabelsFor: ['documents', 'sections', 'properties'],

  // includes the offsets
  includeSelectors: true,
  includeRaw: true,

  // Custom mappings for term resolution
  prefix: {
    schema: 'http://schema.org/',
  },
  mappings: {
    'same as': 'rdfs:sameAs',
    'is a': 'rdf:type',
  },

}

const filePath = resolve('./example-vault/White Rabbit.md')
const { term, dataset } = await triplifyFile(filePath, options)

console.log(await prettyPrint(dataset, ns))
