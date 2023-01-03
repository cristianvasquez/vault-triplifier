import tests from 'docs-and-graphs/test/tests.js'
import splitOnIdentifiers from './support/splitOnIdentifiers.js'
import splitOnTags from './support/splitOnTags.js'
import splitOnHeaders from './support/splitOnHeaders.js'
import yamlLike from './support/yamlLike.js'

const allTests = [yamlLike, ...tests]

export {
  allTests,
  splitOnTags, splitOnIdentifiers, splitOnHeaders, yamlLike,
}
