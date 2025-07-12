import ns from '../src/namespaces.js'
import { nameFromUri } from '../src/termMapper/termMapper.js'
import { triplify } from '../src/triplifier.js'
import { prettyPrint } from './support/serialization.js'

const maxOptions = {
  includeLabelsFor: ['documents', 'sections', 'anchors', 'properties'],
  includeSelectors: true,
  includeRaw: true,
  partitionBy: ['identifier', 'tag', 'headers-all'],
}

const content = `

# Header

[[#Uncle Bob]]

[[Charlie space#Bob with space]]

[[Bravo note]]

### Header 3

#^Some

[[#^Some]]

## Header 4

[[Bravo note#^Some]]

<http://example.org>
`

const { term, dataset } = triplify('/some/Alice.md', content, maxOptions)

for (const { predicate, object } of dataset) {
  if (predicate.equals(ns.dot.link)) {
    console.log(`[[${nameFromUri(object)}]]`, object.value)
  }
}
