import tests from 'docs-and-graphs/test/tests.js'
import breakOnIdentifiers from './support/breakOnIdentifiers.js'
import breakOnTags from './support/breakOnTags.js'

export default [breakOnIdentifiers, breakOnTags, ...tests]
