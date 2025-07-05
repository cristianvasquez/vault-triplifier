import { writeFile } from 'fs/promises'
import { triplifyFile } from '../index.js'

// All 8 possible combinations of the three split options
const combinations = [
  { splitOnId: false, splitOnTag: false, splitOnHeader: false },
  { splitOnId: true,  splitOnTag: false, splitOnHeader: false }, // current default
  { splitOnId: false, splitOnTag: true,  splitOnHeader: false },
  { splitOnId: false, splitOnTag: false, splitOnHeader: true },
  { splitOnId: true,  splitOnTag: true,  splitOnHeader: false },
  { splitOnId: true,  splitOnTag: false, splitOnHeader: true },
  { splitOnId: false, splitOnTag: true,  splitOnHeader: true },
  { splitOnId: true,  splitOnTag: true,  splitOnHeader: true }
]

async function generateSnapshots() {
  const testFile = './test/partition-test-document.md'
  
  console.log('Generating RDF snapshots for all split combinations...')
  
  for (let i = 0; i < combinations.length; i++) {
    const options = combinations[i]
    const filename = `snapshot-${i}-${options.splitOnId ? 'I' : 'i'}${options.splitOnTag ? 'T' : 't'}${options.splitOnHeader ? 'H' : 'h'}.ttl`
    
    console.log(`Generating ${filename} with options:`, options)
    
    try {
      const pointer = await triplifyFile(testFile, options)
      
      // Simple N-Triples format instead of Turtle to avoid serialization issues
      let ntriples = ''
      for (const quad of pointer.dataset) {
        ntriples += `${quad.toString()}\n`
      }
      
      await writeFile(`./test/snapshots/${filename.replace('.ttl', '.nt')}`, ntriples)
      console.log(`✓ Generated ${filename.replace('.ttl', '.nt')} (${pointer.dataset.size} triples)`)
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error.message)
    }
  }
  
  console.log('Snapshot generation complete!')
}

generateSnapshots().catch(console.error)