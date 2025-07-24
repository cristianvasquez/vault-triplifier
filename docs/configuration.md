# Configuration

Complete guide to configuring vault-triplifier options, namespaces, and mappings.

## Basic Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `partitionBy` | `['headers-h2-h3']` | Which headers create separate entities |
| `includeSelectors` | `true` | Include text position information |
| `includeCodeBlockContent` | `true` | Store code block content as literals |
| `parseCodeBlockTurtleIn` | `['turtle;triplify']` | Parse these code blocks as RDF |

```javascript
import { triplify } from "vault-triplifier";

const options = {
  partitionBy: ['headers-h2-h3'],  // Default
  includeSelectors: true,
  prefix: {
    'custom': 'http://example.org/vocab#'
  }
};

const { term, dataset } = triplify('./file.md', content, options);
```

## Partitioning Strategies

| Strategy | Headers | Use Case |
|----------|---------|----------|
| `[]` | None | All properties to document |
| `['headers-h2-h3']` | `##` and `###` | **Default** - Document title + sections |
| `['headers-h1-h2']` | `#` and `##` | Include document title as entity |
| `['headers-h1-h2-h3']` | `#`, `##`, `###` | Very granular partitioning |
| `['headers-all']` | All levels | Maximum granularity |

### Examples

#### Default Partitioning
```javascript
{ partitionBy: ['headers-h2-h3'] }  // Default
```

```markdown
# Team Documentation          ← Document metadata
author :: Alice
created :: 2024-03-15

## Alice Johnson               ← Creates entity
role :: Product Manager
email :: alice@company.com

### Skills                     ← Creates sub-entity  
expertise :: user research
```

**Entities created:**
- `<urn:name:team-documentation>` (document)
- `<urn:name:team-documentation#Alice%20Johnson>` (section) 
- `<urn:name:team-documentation#Alice%20Johnson#Skills>` (subsection)

#### No Partitioning
```javascript
{ partitionBy: [] }
```

All properties attach to document: `<urn:name:team-documentation>`

## Namespace Configuration

### Built-in Namespaces

| Prefix | URI | Available by Default |
|--------|-----|---------------------|
| `schema` | `http://schema.org/` | ✅ Yes |
| `rdf` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | ✅ Yes |
| `rdfs` | `http://www.w3.org/2000/01/rdf-schema#` | ✅ Yes |
| `xsd` | `http://www.w3.org/2001/XMLSchema#` | ✅ Yes (RDF standard) |
| `foaf` | `http://xmlns.com/foaf/0.1/` | ❌ Must configure |
| `dc` | `http://purl.org/dc/terms/` | ❌ Must configure |
| `owl` | `http://www.w3.org/2002/07/owl#` | ❌ Must configure |

### Custom Namespaces

```javascript
const options = {
  prefix: {
    'team': 'http://company.com/team#',
    'project': 'http://company.com/projects#',
    'skill': 'http://company.com/skills#'
  }
};
```

Usage in documents:
```markdown
# Employee Profile

## Alice
schema:name :: Alice Johnson
team:role :: Product Manager  
team:level :: Senior
skill:expertise :: user research
project:current :: [[search-enhancement]]
```

### Override Built-ins

```javascript
const options = {
  useDefaultNamespaces: false,
  prefix: {
    'schema': 'https://schema.org/',  // HTTPS instead of HTTP
    'custom': 'http://example.org/vocab#'
  }
};
```

## Property Mappings

### Default Mappings

| Property | Maps to | Example |
|----------|---------|---------|
| `is a` | `rdf:type` | `is a :: Person` → `<rdf:type> "Person"` |
| `same as` | `rdfs:sameAs` | `same as :: [[Alice]]` → `<rdfs:sameAs> <urn:name:Alice>` |

### Custom Mappings

```javascript
const options = {
  mappings: {
    'type': 'rdf:type',
    'related to': 'rdfs:seeAlso',
    'member of': 'team:memberOf',
    'reports to': 'team:reportsTo',
    'specializes in': 'skill:specialization'
  }
};
```

Usage:
```markdown
# Team Structure

## Alice
type :: Person
member of :: [[Product Team]]
reports to :: [[Director of Product]]
specializes in :: [[user research]]
related to :: [[market analysis]]
```

## Code Block Configuration

### Turtle Parsing

| Option | Values | Description |
|--------|--------|-------------|
| `parseCodeBlockTurtleIn` | `['turtle;triplify']` | Default - parse turtle blocks |
| | `['turtle', 'rdf', 'n3']` | Multiple formats |
| | `[]` | Disable turtle parsing |

```markdown
# Knowledge Base

## RDF Data

\`\`\`turtle;triplify
@prefix ex: <http://example.org/> .
ex:Alice ex:knows ex:Bob .
ex:Bob ex:worksAt ex:Company .
\`\`\`

\`\`\`javascript
// This stays as content
console.log('Not parsed as RDF');
\`\`\`
```

### Content Storage

```javascript
const options = {
  includeCodeBlockContent: true,   // Store as dot:content literals
  parseCodeBlockTurtleIn: ['turtle;triplify']  // Also parse as RDF
};
```

## Environment-Specific Configs

### Development
```javascript
const devOptions = {
  partitionBy: [],                // Simple - everything to document
  includeSelectors: false,        // Faster processing  
  parseCodeBlockTurtleIn: [],     // Skip RDF parsing
  prefix: {
    'test': 'http://localhost/test#'
  }
};
```

### Production
```javascript
const prodOptions = {
  partitionBy: ['headers-h2-h3'], // Default partitioning
  includeSelectors: true,         // Full functionality
  parseCodeBlockTurtleIn: ['turtle;triplify'],
  prefix: {
    'org': 'https://company.com/vocab#',
    'project': 'https://company.com/projects#'
  },
  mappings: {
    'is a': 'rdf:type',
    'member of': 'org:memberOf'
  }
};
```

## Frontmatter Properties

YAML frontmatter becomes properties on the document entity (does NOT override configuration):

```yaml
---
title: "My Document"
author: "John Doe"
tags: [example, demo]
created: "2024-03-15"
---
```

**Generates:** Properties attached to the file entity:
```turtle
<file:///./my-document.md> <urn:property:title> "My Document" .
<file:///./my-document.md> <urn:property:author> "John Doe" .
<file:///./my-document.md> <http://pending.org/dot/tag> "example" .
<file:///./my-document.md> <http://pending.org/dot/tag> "demo" .
```

## Complete Example

```javascript
const options = {
  // Partitioning
  partitionBy: ['headers-h2-h3'],
  
  // Output options
  includeSelectors: true,
  includeCodeBlockContent: true,
  parseCodeBlockTurtleIn: ['turtle;triplify'],
  
  // Namespaces
  prefix: {
    'team': 'http://company.com/team#',
    'project': 'http://company.com/projects#',
    'skill': 'http://company.com/skills#'
  },
  
  // Property mappings
  mappings: {
    'is a': 'rdf:type',
    'type': 'rdf:type', 
    'member of': 'team:memberOf',
    'reports to': 'team:reportsTo',
    'works on': 'project:assignedTo',
    'specializes in': 'skill:specialization'
  }
};

// Use with content
const { term, dataset } = triplify('./team.md', markdownContent, options);

// Use with file
import { triplifyFile } from "vault-triplifier/node";
const result = await triplifyFile('./team.md', options);
```

## Validation

Options are validated automatically:

```javascript
import { MarkdownTriplifierOptions } from 'vault-triplifier';

try {
  const validOptions = MarkdownTriplifierOptions.parse(userOptions);
  // Configuration is valid
} catch (error) {
  console.error('Invalid configuration:', error.message);
}
```

## Troubleshooting

| Problem | Check | Solution |
|---------|-------|----------|
| Properties not where expected | `partitionBy` setting | Verify header levels match config |
| Custom namespaces not working | `prefix` definition | Ensure prefix defined in options |
| Mappings not applying | Property name exact match | Check exact spelling and case |
| Turtle parsing failing | Code block language | Use `turtle;triplify` or configured languages |

This covers all configuration options for customizing vault-triplifier behavior.