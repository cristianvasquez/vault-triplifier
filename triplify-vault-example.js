import { triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
  partitionBy: ['headers-all'],
  includeLabelsFor: ['documents', 'sections', 'properties'],
  includeSelectors: true, // includes the offsets where the
  includeRaw: false,

  // Custom mappings for term resolution
  prefix: {
    schema: 'http://schema.org/',
  },
  mappings: {
    'lives in': 'schema:address',
  },

}

const dir = './example-vault'
for await (const pointer of triplifyVault(dir, options)) {
  console.log(await prettyPrint(pointer.dataset, ns))
}
