import { readFile } from 'fs/promises'
import { triplifyFile } from '../index.js'

// Mapping from old boolean combinations to new partitionBy arrays
const combinationMappings = [
  { old: { splitOnId: false, splitOnTag: false, splitOnHeader: false }, new: { partitionBy: [] } },
  { old: { splitOnId: true,  splitOnTag: false, splitOnHeader: false }, new: { partitionBy: ['identifier'] } },
  { old: { splitOnId: false, splitOnTag: true,  splitOnHeader: false }, new: { partitionBy: ['tag'] } },
  { old: { splitOnId: false, splitOnTag: false, splitOnHeader: true },  new: { partitionBy: ['header'] } },
  { old: { splitOnId: true,  splitOnTag: true,  splitOnHeader: false }, new: { partitionBy: ['identifier', 'tag'] } },
  { old: { splitOnId: true,  splitOnTag: false, splitOnHeader: true },  new: { partitionBy: ['identifier', 'header'] } },
  { old: { splitOnId: false, splitOnTag: true,  splitOnHeader: true },  new: { partitionBy: ['tag', 'header'] } },
  { old: { splitOnId: true,  splitOnTag: true,  splitOnHeader: true },   new: { partitionBy: ['identifier', 'tag', 'header'] } }
]

function normalizeDataset(dataset) {
  // Convert dataset to sorted array of strings for comparison
  const triples = []
  for (const quad of dataset) {
    triples.push(quad.toString())
  }
  return triples.sort()
}

async function verifyPartitionChanges() {
  const testFile = './test/partition-test-document.md'
  let allPassed = true
  
  console.log('Verifying partitionBy changes against snapshots...\n')
  
  for (let i = 0; i < combinationMappings.length; i++) {
    const { old, new: newConfig } = combinationMappings[i]
    const snapshotFile = `./test/snapshots/snapshot-${i}-${old.splitOnId ? 'I' : 'i'}${old.splitOnTag ? 'T' : 't'}${old.splitOnHeader ? 'H' : 'h'}.nt`
    
    console.log(`Test ${i}: ${JSON.stringify(old)} → ${JSON.stringify(newConfig)}`)
    
    try {
      // Load expected snapshot
      const expectedContent = await readFile(snapshotFile, 'utf8')
      const expectedTriples = expectedContent.trim().split('\n').filter(line => line.length > 0).sort()
      
      // Generate with new partitionBy syntax
      const pointer = await triplifyFile(testFile, newConfig)
      const actualTriples = normalizeDataset(pointer.dataset)
      
      // Compare
      if (expectedTriples.length !== actualTriples.length) {
        console.log(`  ✗ FAIL: Different number of triples (expected: ${expectedTriples.length}, actual: ${actualTriples.length})`)
        allPassed = false
        continue
      }
      
      let different = false
      for (let j = 0; j < expectedTriples.length; j++) {
        if (expectedTriples[j] !== actualTriples[j]) {
          console.log(`  ✗ FAIL: Different triple at position ${j}`)
          console.log(`    Expected: ${expectedTriples[j]}`)
          console.log(`    Actual:   ${actualTriples[j]}`)
          different = true
          allPassed = false
          break
        }
      }
      
      if (!different) {
        console.log(`  ✓ PASS: ${actualTriples.length} triples match perfectly`)
      }
      
    } catch (error) {
      console.log(`  ✗ ERROR: ${error.message}`)
      allPassed = false
    }
    
    console.log()
  }
  
  if (allPassed) {
    console.log('🎉 All tests passed! The partitionBy refactoring is working correctly.')
  } else {
    console.log('❌ Some tests failed. Please check the differences above.')
    process.exit(1)
  }
}

verifyPartitionChanges().catch(console.error)