import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import grapoi from 'grapoi'
import rdf from 'rdf-ext'
import { markdownToRDF } from '../src/markdown-to-RDF.js'
import ns from '../src/namespaces.js'

import { createTermMapper } from '../src/termMapper/defaultTermMapper.js'
import { prettyPrint } from './support/serialization.js'

import {
  allTests,
  splitOnHeaders,
  splitOnIdentifiers,
  splitOnTags,
} from './tests.js'

expect.extend({ toMatchSnapshot })
const baseNamespace = rdf.namespace('http://my-vault.org/')

const context = {
  termMapper: createTermMapper({

    documentUri: ns.ex.document,
  }),
  path: 'file.md',
  pointer: grapoi({ dataset: rdf.dataset(), factory: rdf, term: ns.ex.file }),
}

describe('toRDF', async function () {
  for (const current of allTests) {
    it(current.title, async function () {
      const fullText = current.markdown
      const pointer = markdownToRDF(fullText, context, { baseNamespace })
      const pretty = await prettyPrint(pointer.dataset)
      expect(pretty).toMatchSnapshot(this)
    })
  }
})

describe('splitOnTag', async function () {
  it('splitOnTag:false', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: false, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnTag:true', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnTag:true addLabels:true', async function () {
    const fullText = splitOnTags.markdown
    const options = { splitOnTag: true, addLabels: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })
})

describe('splitOnId', async function () {
  it('splitOnId:false', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: false, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnId:true', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnId:true addLabels:true', async function () {
    const fullText = splitOnIdentifiers.markdown
    const options = { splitOnId: true, addLabels: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })
})

describe('splitOnHeader', async function () {
  it('splitOnHeader:false', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: false, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnHeader:true', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnHeader:true addLabels:true', async function () {
    const fullText = splitOnHeaders.markdown
    const options = { splitOnHeader: true, addLabels: true, baseNamespace }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

  it('splitOnHeader:true includeWikiPaths:true', async function () {
    const fullText = splitOnHeaders.markdown
    const options = {
      splitOnHeader: true,
      includeWikiPaths: true,
      baseNamespace,
    }
    const pointer = markdownToRDF(fullText, context, options)
    const pretty = await prettyPrint(pointer.dataset)
    expect(pretty).toMatchSnapshot(this)
  })

})
