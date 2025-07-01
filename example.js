import { triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
  customMappings: {
    // Will map an attribute to a known rdf-property
    'lives in': ns.schema.address,
  },
  // will split the document using the nested headers, creating connected rdf-entities.
  splitOnHeader: true,
  baseNamespace: ns.ex,
  addLabels: true,
  namespaces: ns,
  includeWikipaths: true,
}

const dir = './example-vault'
const dataset = await triplifyVault(dir, options)

console.log(await prettyPrint(dataset, ns))
