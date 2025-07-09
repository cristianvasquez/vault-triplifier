import { triplify } from './src/triplifier.js'

const content = `---
hello: world
---

# Alice

One can declare properties in this way:

is a :: Person`

const {term, dataset} = triplify('/path.md', content)

console.log(dataset.toString())
