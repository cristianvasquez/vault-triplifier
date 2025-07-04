import { triplifyFile, triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
// will partition the document into blocks when it encounters headings
  partitionBy: ['header'],
  // Will add labels to properties
  addLabels: true,

  // includes the offsets
  includeSelectors: false,
  includeRaw: true,

  // Custom mappings for term resolution
  mappings: {
    namespaces: {
      schema: "http://schema.org/"
    },
    mappings: [
      {
        type: "inlineProperty",
        key: "lives in", 
        predicate: "schema:address"
      }
    ]
  }
}

// A pointer is the dataset + the root
const pointer = await triplifyFile('./test/test-vault/Alice.md', options)

const dataset = pointer.dataset

console.log(await prettyPrint(dataset, ns))
