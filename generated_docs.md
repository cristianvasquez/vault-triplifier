# Vault Triplifier

Convert markdown and canvas files to RDF/Turtle format with rich semantic relationships.

## Installation

```bash
npm install vault-triplifier
```

## Usage

```javascript
import { triplifyFile } from 'vault-triplifier'
import ns from 'vault-triplifier/namespaces'

const options = {
  splitOnHeader: true,
  addLabels: true,
  namespaces: ns
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

### Document Splitting Options

| Option          | Type    | Default | Description                                                            |
|-----------------|---------|---------|------------------------------------------------------------------------|
| `splitOnHeader` | Boolean | `false` | Create separate RDF entities for each header block                     |
| `splitOnTag`    | Boolean | `false` | Create separate RDF entities for elements with tags (#tag)             |
| `splitOnId`     | Boolean | `true`  | Create separate RDF entities for elements with block identifiers (^id) |

### Link and Path Options

| Option             | Type    | Default | Description                                    |
|--------------------|---------|---------|------------------------------------------------|
| `includeSelectors` | Boolean | `true`  | Add `dot:selector` triples for block selectors |

### Label and Naming Options

| Option      | Type    | Default | Description                                              |
|-------------|---------|---------|----------------------------------------------------------|
| `addLabels` | Boolean | `false` | Automatically add `schema:name` labels to generated URIs |

### Mapping and Transformation Options

| Option           | Type   | Default     | Description                                           |
|------------------|--------|-------------|-------------------------------------------------------|
| `customMappings` | Object | `undefined` | Map custom property names to known RDF properties     |
| `namespaces`     | Object | `undefined` | Namespace functions for resolving prefixed properties |

## Examples

### Basic Usage

```javascript
import { triplifyFile } from 'vault-triplifier'
import ns from 'vault-triplifier/namespaces'

const options = {
  namespaces: ns
}

// Process a single file
const pointer = await triplifyFile('test.md', options)
```

### Split on Headers

```javascript
const markdown = `
# People

## Alice
age:: 30

## Bob  
age:: 25
`

const options = {
  splitOnHeader: true,
  addLabels: true,
  namespaces: ns
}

// Creates separate entities for Alice and Bob
const pointer = await triplifyFile('people.md', options)
```

### Custom Mappings

```javascript
const options = {
  customMappings: {
    'lives in': ns.schema.address,
    'knows': ns.foaf.knows
  },
  namespaces: ns
}

const markdown = `
# Alice
lives in:: New York
knows:: [[Bob]]
`

const pointer = await triplifyFile('alice.md', options)
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
  splitOnId: true, // default
  namespaces: ns
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
  splitOnTag: true,
  namespaces: ns
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
