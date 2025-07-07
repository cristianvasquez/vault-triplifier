import { writeFile } from 'fs/promises'
import { triplifyFile } from '../index.js'

// All partition combinations including the new header options
const combinations = [
  { name: 'none', partitionBy: [] },
  { name: 'identifier', partitionBy: ['identifier'] }, // current default
  { name: 'tag', partitionBy: ['tag'] },
  { name: 'header', partitionBy: ['header'] },
  { name: 'headers-h1-h2', partitionBy: ['headers-h1-h2'] },
  { name: 'headers-h1-h2-h3', partitionBy: ['headers-h1-h2-h3'] },
  { name: 'identifier-tag', partitionBy: ['identifier', 'tag'] },
  { name: 'identifier-header', partitionBy: ['identifier', 'header'] },
  { name: 'identifier-headers-h1-h2', partitionBy: ['identifier', 'headers-h1-h2'] },
  { name: 'identifier-headers-h1-h2-h3', partitionBy: ['identifier', 'headers-h1-h2-h3'] },
  { name: 'tag-header', partitionBy: ['tag', 'header'] },
  { name: 'tag-headers-h1-h2', partitionBy: ['tag', 'headers-h1-h2'] },
  { name: 'tag-headers-h1-h2-h3', partitionBy: ['tag', 'headers-h1-h2-h3'] },
  { name: 'identifier-tag-header', partitionBy: ['identifier', 'tag', 'header'] }
]

async function generateSnapshots() {
  const testFile = './test/partition-test-document.md'
  
  console.log('Generating RDF snapshots for all split combinations...')
  
  for (let i = 0; i < combinations.length; i++) {
    const config = combinations[i]
    const filename = `snapshot-${i}-${config.name}.nt`
    
    console.log(`Generating ${filename} with partitionBy:`, config.partitionBy)
    
    try {
      const pointer = await triplifyFile(testFile, config)
      
      // Simple N-Triples format instead of Turtle to avoid serialization issues
      let ntriples = ''
      for (const quad of pointer.dataset) {
        ntriples += `${quad.toString()}\n`
      }
      
      await writeFile(`./test/snapshots/${filename}`, ntriples)
      console.log(`✓ Generated ${filename} (${pointer.dataset.size} triples)`)
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error.message)
    }
  }
  
  console.log('Snapshot generation complete!')
}

generateSnapshots().catch(console.error)