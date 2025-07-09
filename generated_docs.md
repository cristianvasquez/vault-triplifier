# Vault Triplifier API

Convert markdown content to RDF/Turtle format with semantic relationships.

## Installation

```bash
npm install vault-triplifier
```

## Usage

```javascript
// Content-based processing
import { triplify } from 'vault-triplifier'

const content = `# Alice
is a :: Person
age :: 25`

const { term, dataset } = triplify('./alice.md', content)

// File-based processing
import { triplifyFile } from 'vault-triplifier/node'

const { term, dataset } = await triplifyFile('./alice.md', options)
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
import { triplify } from 'vault-triplifier'

const content = `# Test
is a :: Document`

const { term, dataset } = triplify('./test.md', content)
```

### Partition on Headers

```javascript
const content = `# People

## Alice
age :: 30

## Bob  
age :: 25`

const options = {
  partitionBy: ['headers-h1-h2'],
  includeLabelsFor: ['sections']
}

const { term, dataset } = triplify('./people.md', content, options)
```

### Custom Mappings

```javascript
const options = {
  prefix: {
    schema: 'http://schema.org/',
    foaf: 'http://xmlns.com/foaf/0.1/'
  },
  mappings: {
    'lives in': 'schema:address',
    'knows': 'foaf:knows'
  }
}

const content = `# Alice
lives in :: New York
knows :: [[Bob]]`

const { term, dataset } = triplify('./alice.md', content, options)
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
import { triplify } from 'vault-triplifier'

const options = {
  prefix: {
    "ex": "http://example.org/",
    "pkm": "https://pkm.example.com/"
  },
  mappings: {
    "is a": "rdf:type",
    "knows": "pkm:knows"
  }
}

const content = `# My Note
is a :: Document`
const { term, dataset } = triplify('./my-note.md', content, options)
```

### Block Identifiers

```javascript
const content = `# People

## Alice ^alice
age :: 30

## Bob ^bob
age :: 25`

const options = {
  partitionBy: ['identifier']
}

const { term, dataset } = triplify('./people.md', content, options)
```

### Tags

```javascript
const content = `# People

## Alice #person
age :: 30

## Bob #person  
age :: 25`

const options = {
  partitionBy: ['tag']
}

const { term, dataset } = triplify('./people.md', content, options)
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

### `triplify(path, content, options)`

Process markdown content directly.

**Parameters:**
- `path` (string) - Path identifier for the content
- `content` (string) - Markdown content to process
- `options` (object) - Configuration options

**Returns:** `{ term, dataset }` - Term and RDF dataset

### `triplifyFile(filePath, options)`

Process a markdown or canvas file from filesystem.

**Parameters:**
- `filePath` (string) - Path to the file to process
- `options` (object) - Configuration options

**Returns:** Promise resolving to `{ term, dataset }`

## Documentation

For comprehensive documentation including progressive examples, syntax reference, and configuration guide, see the [`docs/`](docs/) directory:

- **[Complete Documentation](docs/index.md)** - Main documentation hub with examples and guides
- **[Basic Properties](docs/examples/01-basic-properties.md)** - Learn the fundamental syntax
- **[Namespace Prefixes](docs/examples/02-namespace-prefixes.md)** - Using semantic vocabularies
- **[Links and References](docs/examples/03-links-and-references.md)** - Connecting documents
- **[Inline Semantics](docs/examples/04-inline-semantics.md)** - Embedding properties in prose
- **[Document Partitioning](docs/examples/05-document-partitioning.md)** - Controlling semantic sections
- **[Advanced Mappings](docs/examples/06-advanced-mappings.md)** - Complex relationships
- **[Frontmatter Integration](docs/examples/07-frontmatter-integration.md)** - YAML metadata support
- **[Syntax Reference](docs/syntax-reference.md)** - Complete syntax guide
- **[Configuration Guide](docs/configuration.md)** - Options and customization
- **[RDF Output Guide](docs/rdf-output.md)** - Understanding generated RDF

---

*Note: The comprehensive documentation in the `docs/` directory was created by Claude Code to provide detailed examples and guidance for semantic document creation and AI agent training.*
