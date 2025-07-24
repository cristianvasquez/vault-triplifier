import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'
import { triplify } from '../index.js'
import { glob } from 'glob'

// Configuration with all options enabled
const maxOptions = {
  includeLabelsFor: ['documents', 'sections', 'properties'],
  includeSelectors: true,
  includeRaw: true,
  partitionBy: ['headers-all'],
}

async function generateVaultSnapshots () {
  const testVaultPath = './test/test-vault'
  const outputDir = './test/vault-snapshots'

  // Create output directory
  await mkdir(outputDir, { recursive: true })

  console.log('Generating RDF snapshots for all test-vault files...')
  console.log('Options:', maxOptions)

  // Find all markdown and canvas files, excluding .obsidian
  const files = await glob('**/*.{md,canvas}', {
    cwd: testVaultPath,
    ignore: '.obsidian/**',
  })

  console.log(`Found ${files.length} files to process`)

  for (const file of files) {
    const sourcePath = join(testVaultPath, file)

    const content = await readFile(sourcePath, 'utf8')

    console.log(`Processing ${file}...`)

    try {
      const pointer = await triplify(sourcePath, content, maxOptions)
      let ntriples = pointer.dataset.toString()
      
      // Create safe filename: replace slashes with underscores and change extension to .nt
      const safeName = file.replace(/[\/\\]/g, '_').replace(/\.(md|canvas)$/, '.nt')
      const targetPath = join(outputDir, safeName)
      
      await writeFile(targetPath, ntriples)
      console.log(`✓ Generated ${safeName} (${pointer.dataset.size} triples)`)
    } catch (error) {
      console.error(`✗ Failed to process ${file}:`, error.message)
    }
  }

  console.log('Vault snapshot generation complete!')
}

generateVaultSnapshots().catch(console.error)
