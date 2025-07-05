# Vault Triplifier

Convert markdown and canvas files to RDF/Turtle format with rich semantic relationships.

## Installation

```bash
npm install vault-triplifier
```

## Usage

```javascript
import { triplifyFile } from 'vault-triplifier'

const options = {
  partitionBy: ['header'],
  includeLabelsFor: ['documents', 'sections', 'properties'],
  mappings: {
    namespaces: {
      schema: 'http://schema.org/',
      ex: 'http://example.org/'
    },
    mappings: [
      {
        type: 'inlineProperty',
        key: 'is a',
        predicate: 'rdf:type'
      }
    ]
  }
}

// For a single file
const pointer = await triplifyFile('alice.md', options)
console.log([...pointer.dataset]) // RDF quads

// For an entire directory (this will resolve links between notes)
import { triplifyVault } from 'vault-triplifier'

const dataset = await triplifyVault('./my-vault', options)
console.log([...dataset]) // All RDF quads from all files
```

## Options

### Configuration Options

All options are optional and have sensible defaults.

### Document Partitioning Options

| Option        | Type     | Default         | Description                                                            |
|---------------|----------|-----------------|------------------------------------------------------------------------|
| `partitionBy` | Array    | `['identifier']` | Array of partitioning strategies: `'header'`, `'tag'`, `'identifier'` |

### Content Options

| Option             | Type    | Default | Description                                           |
|--------------------|---------|---------|-------------------------------------------------------|
| `includeSelectors` | Boolean | `true`  | Add text position selectors for blocks               |
| `includeRaw`       | Boolean | `false` | Include raw markdown content in blocks               |

### Label Options

| Option            | Type  | Default | Description                                                    |
|-------------------|-------|---------|----------------------------------------------------------------|
| `includeLabelsFor` | Array | `[]`    | Add labels for: `'documents'`, `'sections'`, `'anchors'`, `'properties'` |

### Mapping Options

| Option     | Type   | Default | Description                                    |
|------------|--------|---------|------------------------------------------------|
| `mappings` | Object | Built-in defaults | Custom mappings with namespaces and properties |

## Examples

### Basic Usage

```javascript
import { triplifyFile } from 'vault-triplifier'

const options = {
  partitionBy: ['identifier'], // default
  includeLabelsFor: []
}

// Process a single file
const pointer = await triplifyFile('test.md', options)
```

### Partition on Headers

```javascript
const markdown = `
# People

## Alice
age:: 30

## Bob  
age:: 25
`

const options = {
  partitionBy: ['header'],
  includeLabelsFor: ['sections']
}

// Creates separate entities for Alice and Bob
const pointer = await triplifyFile('people.md', options)
```

### Custom Mappings

```javascript
const options = {
  mappings: {
    namespaces: {
      schema: 'http://schema.org/',
      foaf: 'http://xmlns.com/foaf/0.1/'
    },
    mappings: [
      {
        type: 'inlineProperty',
        key: 'lives in',
        predicate: 'schema:address'
      },
      {
        type: 'inlineProperty',
        key: 'knows',
        predicate: 'foaf:knows'
      }
    ]
  }
}

const markdown = `
# Alice
lives in:: New York
knows:: [[Bob]]
`

const pointer = await triplifyFile('alice.md', options)
```

Alternatively, create a JSON file (e.g., `mappings.json`) with the following structure:

```json
{
  "namespaces": {
    "ex": "http://example.org/",
    "pkm": "https://pkm.example.com/"
  },
  "mappings": [
    {
      "type": "inlineProperty",
      "key": "is a",
      "predicate": "rdf:type"
    },
    {
      "type": "inlineProperty",
      "key": "knows",
      "predicate": "pkm:knows"
    }
  ]
}
```

Then, pass the mappings object directly:

```javascript
import { triplifyFile } from 'vault-triplifier';

const options = {
  mappings: {
    namespaces: {
      "ex": "http://example.org/",
      "pkm": "https://pkm.example.com/"
    },
    mappings: [
      {
        "type": "inlineProperty",
        "key": "is a",
        "predicate": "rdf:type"
      },
      {
        "type": "inlineProperty",
        "key": "knows",
        "predicate": "pkm:knows"
      }
    ]
  }
};

const pointer = await triplifyFile('my-note.md', options);
```

### Block Identifiers

```javascript
const markdown = `
# People

## Alice ^alice
age:: 30

## Bob ^bob
age:: 25
`

const options = {
  partitionBy: ['identifier'] // default
}

// Creates URIs ending with /alice and /bob
const pointer = await triplifyFile('people.md', options)
```

### Tags

```javascript
const markdown = `
# People

## Alice #person
age:: 30

## Bob #person  
age:: 25
`

const options = {
  partitionBy: ['tag']
}

// Creates separate entities for tagged elements
const pointer = await triplifyFile('people.md', options)
```

## Built-in Property Mappings

The system includes built-in mappings for common properties:

- `'is a'` → `rdf:type`
- `'same as'` → `rdf:sameAs`

## Available Namespaces

When using the `namespaces` option, these prefixes are available:

- `rdf:` - RDF vocabulary
- `rdfs:` - RDF Schema
- `schema:` - Schema.org
- `foaf:` - Friend of a Friend
- `xsd:` - XML Schema Datatypes
- `dot:` - Internal vault-triplifier vocabulary
- `ex:` - Example namespace

## Markdown Syntax

### Property Syntax

```markdown
# Note Title

property:: value
another:: [[linked note]]
inline:: (property:: value)
```

### Headers with Identifiers

```markdown
## Section Name ^section-id

content here
```

### Tags

```markdown
## Item Name #category

content here
```

### YAML Frontmatter

```yaml
---
title: My Note
tags: [ example, demo ]
author: John Doe
---
```

## Canvas Files

The triplifier also supports Obsidian canvas files (`.canvas`), converting:

- Nodes (text, files, groups) to RDF entities
- Edges to RDF relationships
- Positioning and styling information

Same options apply to canvas processing, with edge labels supporting custom mappings and namespace resolution.

## API Reference

### `triplifyFile(filePath, options)`

Process a single markdown or canvas file.

**Parameters:**

- `filePath` (string) - Path to the file to process
- `options` (object) - Configuration options

**Returns:** Promise resolving to a Grapoi pointer with RDF dataset

### `triplifyVault(directory, options)`

Process all markdown and canvas files in a directory.

**Parameters:**

- `directory` (string) - Directory path to process
- `options` (object) - Configuration options

**Returns:** Promise resolving to an RDF dataset containing all triples
