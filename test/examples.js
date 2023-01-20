import { expect } from 'expect'
import toMatchSnapshot from 'expect-mocha-snapshot'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { createTriplifier } from '../index.js'
import ns from '../src/namespaces.js'
import { prettyPrint } from './support/serialization.js'

expect.extend({ toMatchSnapshot })

const dir = 'test/markdown'
const triplifier = await createTriplifier(dir)

describe('triplify examples', async function () {

  for (const file of triplifier.getFiles()) {
    it(file, async function () {

      const text = await readFile(resolve(dir, file), 'utf8')
      const pointer = triplifier.toRDF(text, { path: file },
        {
          addLabels: true,
          includeWikiPaths: true,
          splitOnHeader: true,
          baseNamespace: ns.ex,
          namespaces: ns,
        })

      const pretty = await prettyPrint(pointer.dataset)
      expect(pretty).toMatchSnapshot(this)
    })
  }
})


