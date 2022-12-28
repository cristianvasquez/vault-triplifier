import { expect } from 'expect'
import { toRdf } from '../index.js'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { prettyPrint } from './support/serialization.js'
import tests from './tests.js'

expect.extend({ toMatchSnapshot })

describe('toRDF', async function () {
  for (const current of tests) {
    it(current.title, async function () {
      const fullText = current.markdown
      const pointer = toRdf(fullText)
      const pretty = await prettyPrint(pointer.dataset)
      expect(pretty).toMatchSnapshot(this)
    })
  }
})
