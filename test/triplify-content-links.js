import ns from '../src/namespaces.js'
import { triplify } from '../src/triplifier.js'
import { prettyPrint } from './support/serialization.js'

const content = `[[#Bob]]

[[Charlie#Bob]]

[[Bravo]]
`

const { term, dataset } = triplify('/some/Alice.md', content)

// console.log(dataset.toString())
console.log(await prettyPrint(dataset, ns))
