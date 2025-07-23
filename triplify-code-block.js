import ns from './src/namespaces.js'
import { triplify } from './src/triplifier.js'
import { prettyPrint } from './test/support/serialization.js'

const content = `\`\`\`osg
PREFIX dot: <http://pending.org/dot/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prov: <http://www.w3.org/ns/prov#>


SELECT DISTINCT ?repository ?document WHERE {  
  GRAPH ?document {
    ?document dot:inRepository ?repository .
    FILTER(STRENDS(STR(?document), ".triplify"))
  }
}

\`\`\`
`

const { term, dataset } = triplify('/some/Alice.md', content)

// console.log(dataset.toString())
console.log(await prettyPrint(dataset, ns))
