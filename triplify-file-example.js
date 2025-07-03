import { triplifyFile, triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
// will split the document into a tree when it encounters headings
  splitOnHeader: true,
  // will resolve the specified vocabularies
  namespaces: ns,
  customMappings: {
    // Will map an attribute to a known rdf-property
    'lives in': ns.schema.address,
  },
  // Will add labels to properties
  addLabels: true,

  // includes the offsets
  includeSelectors: false,
  includeRaw: true,

}

// A pointer is the dataset + the root
const pointer = await triplifyFile('./example-vault/Alice.md', options)

const dataset = pointer.dataset

console.log(await prettyPrint(dataset, ns))
