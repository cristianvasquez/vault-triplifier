import ns from './src/namespaces.js'
import { triplify } from './src/triplifier.js'
import { prettyPrint } from './test/support/serialization.js'

const content = `---
hello: world
---

# Alice

One can declare properties in this way:

is a :: schema:Person`

const { term, dataset } = triplify('/some/Alice.md', content)

// console.log(dataset.toString())
console.log(await prettyPrint(dataset, ns))
