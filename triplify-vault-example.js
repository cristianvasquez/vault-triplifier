import { triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
  // will resolve these
  namespaces: ns,
  customMappings: {
    // Will map an attribute to a known rdf-property
    'lives in': ns.schema.address,
  },
  addLabels: true,
  includeSelectors: true, // includes the offsets where the
}

const dir = './example-vault'

const dataset = await triplifyVault(dir, options)

console.log(await prettyPrint(dataset, ns))
