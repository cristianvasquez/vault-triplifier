import { triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
  partitionBy: ['header'],
  addLabels: true,
  includeText: true,
  includeSelectors: true, // includes the offsets where the
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

const dir = './test/test-vault'

const dataset = await triplifyVault(dir, options)

console.log(await prettyPrint(dataset, ns))
