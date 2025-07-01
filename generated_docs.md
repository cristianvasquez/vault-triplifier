# Vault Triplifier

Convert markdown and canvas files to RDF/Turtle format with rich semantic relationships.

## Installation

```bash
npm install vault-triplifier
```

## Usage

```javascript
import { toRDF } from 'vault-triplifier'
import ns from 'vault-triplifier/namespaces'

const markdown = `
# Alice
age:: 30
knows:: [[Bob]]
`

const options = {
  baseNamespace: ns.ex,
  splitOnHeader: true,
  addLabels: true,
  namespaces: ns
}

const pointer = toRDF(markdown, { path: 'alice.md' }, options)
console.log([...pointer.dataset]) // RDF quads
```

## Options

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `baseNamespace` | Function | **Required.** Base namespace for generated URIs (e.g., `ns.ex`) |

### Document Splitting Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `splitOnHeader` | Boolean | `false` | Create separate RDF entities for each header block |
| `splitOnTag` | Boolean | `false` | Create separate RDF entities for elements with tags (#tag) |
| `splitOnId` | Boolean | `true` | Create separate RDF entities for elements with block identifiers (^id) |

### Link and Path Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeWikipaths` | Boolean | `true` | Add `dot:wikipath` triples containing file paths |
| `includeSelectors` | Boolean | `true` | Add `dot:selector` triples for block selectors |

### Label and Naming Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `addLabels` | Boolean | `false` | Automatically add `schema:name` labels to generated URIs |

### Mapping and Transformation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customMappings` | Object | `undefined` | Map custom property names to known RDF properties |
| `namespaces` | Object | `undefined` | Namespace functions for resolving prefixed properties |

## Examples

### Basic Usage

```javascript
import { toRDF } from 'vault-triplifier'
import ns from 'vault-triplifier/namespaces'

const options = {
  baseNamespace: ns.ex,
  namespaces: ns
}

const pointer = toRDF('# Hello\nauthor:: John', { path: 'test.md' }, options)
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
  baseNamespace: ns.ex,
  splitOnHeader: true,
  addLabels: true,
  namespaces: ns
}

// Creates separate entities for Alice and Bob
const pointer = toRDF(markdown, { path: 'people.md' }, options)
```

### Custom Mappings

```javascript
const options = {
  baseNamespace: ns.ex,
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

const pointer = toRDF(markdown, { path: 'alice.md' }, options)
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
  baseNamespace: ns.ex,
  splitOnId: true, // default
  namespaces: ns
}

// Creates URIs ending with /alice and /bob
const pointer = toRDF(markdown, { path: 'people.md' }, options)
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
  baseNamespace: ns.ex,
  splitOnTag: true,
  namespaces: ns
}

// Creates separate entities for tagged elements
const pointer = toRDF(markdown, { path: 'people.md' }, options)
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
tags: [example, demo]
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

### `toRDF(markdown, fileInfo, options)`

Convert markdown to RDF.

**Parameters:**
- `markdown` (string) - Markdown content
- `fileInfo` (object) - File information with `path` property
- `options` (object) - Configuration options

**Returns:** Grapoi pointer with RDF dataset

### `triplifyVault(files, options)`

Process multiple files from a vault.

**Parameters:**
- `files` (array) - Array of file objects with `path` and `content`
- `options` (object) - Configuration options with `getPathByName` function

**Returns:** Grapoi pointer with combined RDF dataset