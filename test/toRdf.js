import ns from '../src/namespaces.js'
import { expect } from 'expect'
import { toRdf } from '../index.js'
import toMatchSnapshot from 'expect-mocha-snapshot'
import rdf from '../src/rdf-ext.js'
import { createTermMapper } from '../src/termMapper/defaultTermMapper.js'
import { prettyPrint } from './support/serialization.js'
import {
  tests, splitOnTags, splitOnIdentifiers, splitOnHeaders,
} from './tests.js'

expect.extend({ toMatchSnapshot })

const context = {
  termMapper: createTermMapper({
    baseNamespace: rdf.namespace('http://my-vault.org/'),
    documentUri: ns.ex.document,
  }),
}

describe('toRDF', async function () {
  for (const current of tests) {
    it(current.title, async function () {
      const fullText = current.markdown
      const pointer = toRdf(fullText, context, {})
      const pretty = await prettyPrint(pointer.dataset)
      expect(pretty).toMatchSnapshot(this)
    })
  }
})

describe('splitOnTag', async function () {
  it('splitOnTag false', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: false }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnTag true', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnTag true addLabels true', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: true, addLabels: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })
})

describe('splitOnId', async function () {
  it('splitOnId false', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: false }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnId true', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnId true addLabels true', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: true, addLabels: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })
})

describe('splitOnHeader', async function () {
  it('splitOnHeader false', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: false }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnHeader true', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnHeader true addLabels true', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: true, addLabels: true }
    const pointer = toRdf(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })
})
