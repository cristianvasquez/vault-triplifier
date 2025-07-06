import { triplifyVault } from './index.js'
import ns from './src/namespaces.js'
import { prettyPrint } from './test/support/serialization.js'

const options = {
  partitionBy: ['header'],
  includeLabelsFor: ['documents', 'sections', 'properties'],
  includeSelectors: true, // includes the offsets where the
  includeRaw: false,

  // Custom mappings for term resolution
  mappings: {
    namespaces: {
      schema: 'http://schema.org/',
    },
    mappings: [
      {
        type: 'inlineProperty',
        key: 'lives in',
        predicate: 'schema:address',
      },
    ],
  },
}

const dir = './example-vault'
for await (const pointer of triplifyVault(dir, options)) {
  console.log(await prettyPrint(pointer.dataset, ns))
}
