# Configuration Guide

Complete guide to configuring vault-triplifier for your specific needs, including options, namespaces, mappings, and advanced customization.

## Basic Configuration

### Default Configuration
```javascript
const defaultOptions = {
  partitionBy: ['identifier'],
  baseIRI: 'file:///',
  includeSelectors: true,
  includeCodeBlockContent: true,
  parseCodeBlockTurtleIn: ['turtle;triplify'],
  useDefaultNamespaces: true,
  namespaces: {},
  mappings: []
}
```

### Using with Different File Types
```javascript
// For markdown files
import { markdownToRDF } from 'vault-triplifier'
const result = await markdownToRDF(content, options)

// For canvas files  
import { canvasToRDF } from 'vault-triplifier'
const result = await canvasToRDF(content, options)

// Generic content processing
import { contentToRDF } from 'vault-triplifier/src/file-to-RDF.js'
const result = await contentToRDF(content, { path: 'file.md' }, options)
```

## Partitioning Configuration

### Partition Strategies
```javascript
{
  // No partitioning - everything attaches to document
  partitionBy: []
  
  // Split on identifier anchors only
  partitionBy: ['identifier']
  
  // Split on tags only  
  partitionBy: ['tag']
  
  // Split on H1 and H2 headers
  partitionBy: ['headers-h1-h2']
  
  // Split on H1, H2, and H3 headers
  partitionBy: ['headers-h1-h2-h3']
  
  // Split on all header levels
  partitionBy: ['headers-all']
  
  // Combine multiple strategies
  partitionBy: ['headers-h1-h2', 'identifier', 'tag']
}
```

### Partitioning Examples

#### No Partitioning
```javascript
const options = { partitionBy: [] }
```
```markdown
# Document
Everything attaches to the main document entity.

property1 :: value1
property2 :: value2

## Section
property3 :: value3  # Still attaches to document
```

#### Header-Only Partitioning
```javascript
const options = { partitionBy: ['headers-h1-h2'] }
```
```markdown
# Document (entity)
doc_property :: document value

## Section (entity)  
section_property :: section value

### Subsection (part of Section entity)
subsection_property :: still section value
```

#### Combined Partitioning
```javascript
const options = { partitionBy: ['headers-h1-h2', 'identifier'] }
```
```markdown
# Document (entity)
## Section (entity)

^concept
concept_property :: concept value  # New entity from identifier
```

## Namespace Configuration

### Built-in Namespaces
```javascript
// Default namespaces (always available)
const defaultNamespaces = {
  'schema': 'http://schema.org/',
  'foaf': 'http://xmlns.com/foaf/0.1/',
  'dc': 'http://purl.org/dc/terms/',
  'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
  'owl': 'http://www.w3.org/2002/07/owl#'
}
```

### Custom Namespaces
```javascript
const options = {
  namespaces: {
    // Domain-specific vocabularies
    'wonderland': 'http://wonderland.example.org/vocab#',
    'story': 'http://narrative.example.org/terms#',
    'char': 'http://characters.example.org/',
    
    // Organization vocabularies
    'company': 'http://mycompany.com/vocab#',
    'project': 'http://mycompany.com/projects#',
    
    // Academic vocabularies
    'bibo': 'http://purl.org/ontology/bibo/',
    'prism': 'http://prismstandard.org/namespaces/basic/2.0/',
    
    // Override defaults if needed
    'schema': 'https://schema.org/'  // HTTPS instead of HTTP
  }
}
```

### Namespace Usage in Documents
```markdown
# Using custom namespaces
wonderland:magicalAbility :: size-changing
story:characterRole :: protagonist
char:firstName :: Alice
company:department :: Engineering
bibo:doi :: 10.1000/182
```

### Disabling Default Namespaces
```javascript
const options = {
  useDefaultNamespaces: false,  // Only use custom namespaces
  namespaces: {
    'custom': 'http://example.org/vocab#'
  }
}
```

## Property Mappings

### Inline Property Mappings
```javascript
const options = {
  mappings: [
    // Map "is a" to rdf:type
    {
      type: "inlineProperty",
      key: "is a", 
      predicate: "rdf:type"
    },
    
    // Map "same as" to owl:sameAs
    {
      type: "inlineProperty",
      key: "same as",
      predicate: "owl:sameAs"
    },
    
    // Custom domain mappings
    {
      type: "inlineProperty",
      key: "related to",
      predicate: "rdfs:seeAlso"
    },
    
    // With custom namespace
    {
      type: "inlineProperty", 
      key: "character type",
      predicate: "story:characterType"
    }
  ]
}
```

Usage in documents:
```markdown
# Alice
Alice :: is a :: schema:Person
Alice :: same as :: https://example.com/alice
Alice :: related to :: [[Wonderland]]
Alice :: character type :: protagonist
```

### Block Property Mappings
```javascript
const options = {
  mappings: [
    // Map frontmatter fields
    {
      type: "frontmatter",
      key: "title",
      predicate: "schema:name"
    },
    {
      type: "frontmatter",
      key: "author", 
      predicate: "schema:author"
    },
    
    // Map block properties
    {
      type: "blockProperty",
      key: "type",
      predicate: "rdf:type"
    }
  ]
}
```

## Base IRI Configuration

### File-based IRIs (Default)
```javascript
const options = {
  baseIRI: 'file:///',  // Default
  // Documents become: file:///path/to/document.md
  // Sections become: file:///path/to/document.md#section-name
}
```

### HTTP IRIs
```javascript
const options = {
  baseIRI: 'https://mysite.com/kb/',
  // Documents become: https://mysite.com/kb/document.md
  // Sections become: https://mysite.com/kb/document.md#section-name
}
```

### Custom IRI Patterns
```javascript
const options = {
  baseIRI: 'http://wonderland.example.org/',
  // Can be used with custom IRI generation logic
}
```

## Code Block Configuration

### Code Block Content Inclusion
```javascript
const options = {
  includeCodeBlockContent: true,  // Default - store code content as literals
  // Set to false to exclude code content from RDF output
}
```

### Turtle Code Block Parsing
```javascript
const options = {
  parseCodeBlockTurtleIn: ['turtle;triplify'],  // Default
  // Parse code blocks with these languages as turtle and include triples
}
```

### Code Block Examples

#### Default Behavior
With default options, both content storage and turtle parsing are enabled:

```markdown
# Document

\`\`\`turtle;triplify
<alice> <knows> <bob> .
<bob> <knows> <charlie> .
\`\`\`

\`\`\`javascript
console.log('hello world')
\`\`\`
```

Results in:
- Turtle content parsed and added as RDF triples to the dataset
- Both code blocks stored with `dot:content` properties
- Both code blocks have `dot:language` properties

#### Content-Only Mode
```javascript
const options = {
  includeCodeBlockContent: true,
  parseCodeBlockTurtleIn: []  // Disable turtle parsing
}
```

Results in:
- No turtle parsing - all code blocks treated as regular content
- Code content stored as `dot:content` literals

#### Turtle-Only Mode  
```javascript
const options = {
  includeCodeBlockContent: false,
  parseCodeBlockTurtleIn: ['turtle;triplify']  // Enable turtle parsing
}
```

Results in:
- Turtle code blocks parsed and triples added to dataset
- No `dot:content` properties stored for any code blocks
- Language metadata still preserved

#### Custom Turtle Languages
```javascript
const options = {
  parseCodeBlockTurtleIn: ['rdf', 'turtle', 'n3', 'custom-rdf']
}
```

```markdown
\`\`\`rdf
<example> <predicate> <object> .
\`\`\`

\`\`\`n3
@prefix ex: <http://example.org/> .
ex:subject ex:property "value" .
\`\`\`
```

### Code Block Error Handling
When turtle parsing fails, the code block falls back to regular content handling:

```markdown
\`\`\`turtle;triplify
Invalid turtle syntax here
\`\`\`
```

- Warning logged to console
- Code block treated as regular content (if `includeCodeBlockContent: true`)
- No triples added to dataset

## Selector Configuration

### Including Text Selectors
```javascript
const options = {
  includeSelectors: true,  // Default
  // Generates Web Annotation selectors for text positions
}
```

### Disabling Selectors
```javascript
const options = {
  includeSelectors: false,
  // Smaller output, no text position information
}
```

### Selector Output Example
With `includeSelectors: true`:
```turtle
<document> <http://www.w3.org/ns/oa#hasSelector> [
  a <http://www.w3.org/ns/oa#TextPositionSelector> ;
  <http://www.w3.org/ns/oa#start> 42 ;
  <http://www.w3.org/ns/oa#end> 156
] .
```

## Advanced Configuration

### Schema Validation
```javascript
import { MarkdownTriplifierOptions } from 'vault-triplifier'

// Options are validated using Zod schema
const validatedOptions = MarkdownTriplifierOptions.parse({
  partitionBy: ['headers-h1-h2'],
  baseIRI: 'https://example.com/',
  namespaces: {
    'custom': 'http://example.org/vocab#'
  }
})
```

### Environment-Specific Configuration

#### Development Configuration
```javascript
const devOptions = {
  partitionBy: ['identifier'],  // Simple partitioning for testing
  includeSelectors: false,      // Faster processing
  baseIRI: 'http://localhost/',
  namespaces: {
    'test': 'http://test.example.org/'
  }
}
```

#### Production Configuration
```javascript
const prodOptions = {
  partitionBy: ['headers-h1-h2', 'identifier'],  // Rich partitioning
  includeSelectors: true,                         // Full functionality
  baseIRI: 'https://production.com/kb/',
  namespaces: {
    // Full vocabulary set
    'org': 'https://myorg.com/vocab#',
    'project': 'https://myorg.com/projects#',
    'bibo': 'http://purl.org/ontology/bibo/'
  },
  mappings: [
    // Production mappings
    { type: "inlineProperty", key: "is a", predicate: "rdf:type" },
    { type: "frontmatter", key: "title", predicate: "schema:name" }
  ]
}
```

## Configuration Patterns

### Academic Research Configuration
```javascript
const academicOptions = {
  partitionBy: ['headers-h1-h2', 'identifier'],
  baseIRI: 'https://research.university.edu/',
  namespaces: {
    'bibo': 'http://purl.org/ontology/bibo/',
    'prism': 'http://prismstandard.org/namespaces/basic/2.0/',
    'fabio': 'http://purl.org/spar/fabio/',
    'org': 'https://research.university.edu/vocab#'
  },
  mappings: [
    { type: "frontmatter", key: "doi", predicate: "bibo:doi" },
    { type: "frontmatter", key: "isbn", predicate: "bibo:isbn" },
    { type: "inlineProperty", key: "cites", predicate: "bibo:cites" }
  ]
}
```

### Business Knowledge Base Configuration
```javascript
const businessOptions = {
  partitionBy: ['headers-h1-h2', 'tag'],
  baseIRI: 'https://company.com/kb/',
  namespaces: {
    'org': 'http://www.w3.org/ns/org#',
    'vcard': 'http://www.w3.org/2006/vcard/ns#',
    'company': 'https://company.com/vocab#'
  },
  mappings: [
    { type: "inlineProperty", key: "reports to", predicate: "org:reportsTo" },
    { type: "inlineProperty", key: "member of", predicate: "org:memberOf" },
    { type: "frontmatter", key: "department", predicate: "company:department" }
  ]
}
```

### Personal Knowledge Management Configuration
```javascript
const personalOptions = {
  partitionBy: ['identifier', 'tag'],
  baseIRI: 'file:///',
  namespaces: {
    'personal': 'https://mysite.com/vocab#',
    'task': 'https://mysite.com/tasks#'
  },
  mappings: [
    { type: "inlineProperty", key: "priority", predicate: "task:priority" },
    { type: "inlineProperty", key: "due", predicate: "task:dueDate" },
    { type: "frontmatter", key: "status", predicate: "task:status" }
  ]
}
```

### Multi-language Configuration
```javascript
const multiLangOptions = {
  partitionBy: ['headers-h1-h2'],
  baseIRI: 'https://site.com/',
  namespaces: {
    'lang': 'http://site.com/lang#'
  },
  mappings: [
    { type: "frontmatter", key: "language", predicate: "dc:language" },
    { type: "frontmatter", key: "title_en", predicate: "schema:name" },
    { type: "frontmatter", key: "title_es", predicate: "lang:nameEs" },
    { type: "frontmatter", key: "title_fr", predicate: "lang:nameFr" }
  ]
}
```

## Configuration Best Practices

### 1. Start Simple
```javascript
// Begin with minimal configuration
const options = {
  partitionBy: ['identifier']
}

// Add complexity as needed
const advancedOptions = {
  partitionBy: ['headers-h1-h2', 'identifier'],
  namespaces: { 'custom': 'http://example.org/' },
  mappings: [/* custom mappings */]
}
```

### 2. Use Standard Vocabularies
```javascript
// Prefer standard vocabularies
const options = {
  namespaces: {
    'schema': 'http://schema.org/',      // Widely supported
    'foaf': 'http://xmlns.com/foaf/0.1/', // Standard for people
    'dc': 'http://purl.org/dc/terms/'    // Standard for metadata
  }
}
```

### 3. Document Your Configuration
```javascript
const options = {
  // Partition by sections and key concepts
  partitionBy: ['headers-h1-h2', 'identifier'],
  
  // Use organization namespace
  namespaces: {
    'org': 'https://myorg.com/vocab#'
  },
  
  // Map common patterns
  mappings: [
    { type: "inlineProperty", key: "is a", predicate: "rdf:type" }
  ]
}
```

### 4. Environment-Specific Configs
```javascript
// config/development.js
export const devConfig = {
  partitionBy: ['identifier'],
  includeSelectors: false,
  baseIRI: 'http://localhost/'
}

// config/production.js  
export const prodConfig = {
  partitionBy: ['headers-h1-h2', 'identifier'],
  includeSelectors: true,
  baseIRI: 'https://production.com/kb/'
}
```

### 5. Validate Configuration
```javascript
import { MarkdownTriplifierOptions } from 'vault-triplifier'

try {
  const config = MarkdownTriplifierOptions.parse(userOptions)
  // Configuration is valid
} catch (error) {
  console.error('Invalid configuration:', error.message)
}
```

## Troubleshooting Configuration

### Common Issues

#### Invalid Partition Strategy
```javascript
// ERROR: Unknown partition strategy
{ partitionBy: ['invalid-strategy'] }

// CORRECT: Use supported strategies
{ partitionBy: ['headers-h1-h2', 'identifier'] }
```

#### Namespace Conflicts
```javascript
// ERROR: Conflicting namespace definitions
{
  useDefaultNamespaces: true,
  namespaces: {
    'schema': 'http://different-schema.org/'  // Conflicts with default
  }
}

// CORRECT: Either override defaults or use different prefix
{
  useDefaultNamespaces: false,
  namespaces: {
    'schema': 'http://different-schema.org/'
  }
}
```

#### Invalid Base IRI
```javascript
// ERROR: Invalid IRI format
{ baseIRI: 'not-a-valid-iri' }

// CORRECT: Valid IRI format
{ baseIRI: 'https://example.com/' }
```

### Debugging Configuration
```javascript
// Enable verbose logging
const options = {
  debug: true,  // If supported
  partitionBy: ['headers-h1-h2']
}

// Check processed options
console.log('Processed options:', options)

// Validate before use
const validated = MarkdownTriplifierOptions.parse(options)
console.log('Validated options:', validated)
```

## Migration Guide

### From Version 1.0 to 1.1
```javascript
// OLD: String-based partition
{ partitionBy: 'header' }

// NEW: Array-based with specific levels
{ partitionBy: ['headers-all'] }

// OLD: Custom header option
{ partitionBy: ['header'] }

// NEW: Renamed and specific
{ partitionBy: ['headers-all'] }
```

### Updating Existing Documents
When changing partition strategies, existing documents may generate different RDF structures. Test thoroughly and consider migration scripts for large document sets.

This configuration guide covers all available options for customizing vault-triplifier behavior. See the [syntax reference](syntax-reference.md) for details on document syntax and [examples](examples/) for practical usage patterns.