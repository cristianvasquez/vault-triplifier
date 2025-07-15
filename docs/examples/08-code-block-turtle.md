# Code Block Turtle Parsing

This example demonstrates how to use code blocks to include RDF triples directly in your markdown documents using the turtle format.

## Basic Turtle Code Blocks

When you use code blocks with the `turtle;triplify` language, the content is parsed as turtle and the resulting triples are added directly to your document's RDF dataset:

```markdown
# Alice in Wonderland

Alice is a curious character who meets many interesting people.

\`\`\`turtle;triplify
<alice> <knows> <bob> .
<alice> <meets> <cheshire-cat> .
<cheshire-cat> <type> <cat> .
<cheshire-cat> <has-ability> "disappearing" .
\`\`\`

Alice also has some documented properties:

age :: 7
curiosity-level :: high
```

## Custom Language Support

You can configure which code block languages should be parsed as turtle:

```javascript
import { triplify } from 'vault-triplifier'

const options = {
  parseCodeBlockTurtleIn: ['turtle', 'rdf', 'n3', 'ttl']
}

const content = `# Knowledge Base

\`\`\`rdf
<person:alice> <foaf:name> "Alice" .
<person:alice> <foaf:age> 7 .
\`\`\`

\`\`\`n3
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix person: <http://example.org/people/> .

<person:bob> foaf:name "Bob" ;
             foaf:knows <person:alice> .
\`\`\`
`

const result = triplify('/kb/characters.md', content, options)
```

## Content Inclusion Options

### Include Both Triples and Content (Default)
```javascript
const options = {
  includeCodeBlockContent: true,        // Store code as literals
  parseCodeBlockTurtleIn: ['turtle;triplify']  // Parse as turtle
}
```

Result: Code content stored AND turtle parsed into triples.

### Triples Only
```javascript
const options = {
  includeCodeBlockContent: false,       // Don't store code content
  parseCodeBlockTurtleIn: ['turtle;triplify']  // Parse as turtle
}
```

Result: Only turtle triples added, no content literals stored.

### Content Only
```javascript
const options = {
  includeCodeBlockContent: true,        // Store code as literals
  parseCodeBlockTurtleIn: []           // Don't parse any languages
}
```

Result: Code stored as content literals, no turtle parsing.

## Advanced Examples

### Namespace Prefixes in Turtle Blocks

```markdown
# Character Relationships

\`\`\`turtle;triplify
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix char: <http://wonderland.example.org/characters/> .
@prefix rel: <http://wonderland.example.org/relationships/> .

char:alice a foaf:Person ;
           foaf:name "Alice" ;
           rel:falls-down char:rabbit-hole ;
           rel:meets char:white-rabbit .

char:white-rabbit a char:Rabbit ;
                  foaf:name "White Rabbit" ;
                  rel:leads char:alice .
\`\`\`
```

### Mixed Code Blocks

```markdown
# Technical Documentation

Here's some RDF data:

\`\`\`turtle;triplify
<doc:example> <dc:title> "Technical Doc" .
<doc:example> <dc:author> "Alice" .
\`\`\`

And here's some JavaScript code:

\`\`\`javascript
// This will be stored as content, not parsed as RDF
function processData(input) {
  return input.map(item => item.value)
}
\`\`\`

And some Python:

\`\`\`python
# Also stored as content only
def analyze_data(data):
    return sum(data) / len(data)
\`\`\`
```

## Error Handling

If turtle syntax is invalid, the system gracefully falls back:

```markdown
# Document with Invalid Turtle

\`\`\`turtle;triplify
This is not valid turtle syntax!
No triples will be parsed from this.
\`\`\`
```

Result:
- Warning logged to console
- Code block treated as regular content (if `includeCodeBlockContent: true`)
- No triples added to the dataset
- Document processing continues normally

## Use Cases

### 1. Semantic Annotations
Add precise RDF triples to complement natural language descriptions:

```markdown
# Research Paper

This paper discusses the relationship between sleep and memory.

\`\`\`turtle;triplify
<paper:sleep-memory-2024> <dc:subject> <concept:sleep> .
<paper:sleep-memory-2024> <dc:subject> <concept:memory> .
<concept:sleep> <related-to> <concept:memory> .
<concept:memory> <improves-with> <concept:sleep> .
\`\`\`
```

### 2. Knowledge Graph Construction
Build detailed knowledge graphs directly in markdown:

```markdown
# Company Structure

\`\`\`turtle;triplify
@prefix org: <http://www.w3.org/ns/org#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix company: <http://company.example.org/> .

company:alice a foaf:Person ;
               foaf:name "Alice Smith" ;
               org:memberOf company:engineering ;
               org:reportsTo company:bob .

company:bob a foaf:Person ;
            foaf:name "Bob Johnson" ;
            org:headOf company:engineering .

company:engineering a org:OrganizationalUnit ;
                    org:hasSubOrganization company:backend-team .
\`\`\`
```

### 3. Data Integration
Integrate external data sources:

```markdown
# External References

\`\`\`turtle;triplify
<local:alice> <owl:sameAs> <https://wikidata.org/entity/Q12345> .
<local:alice> <owl:sameAs> <https://orcid.org/0000-0000-0000-0000> .
<local:project> <funded-by> <https://cordis.europa.eu/project/id/123456> .
\`\`\`
```

## Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeCodeBlockContent` | boolean | `true` | Store code block content as `dot:content` literals |
| `parseCodeBlockTurtleIn` | string[] | `['turtle;triplify']` | Languages to parse as turtle format |

## Best Practices

1. **Use meaningful URIs**: Choose clear, consistent URI patterns for your entities
2. **Include prefixes**: Define namespace prefixes in turtle blocks for readability  
3. **Validate syntax**: Test turtle syntax before including in documents
4. **Combine with metadata**: Use turtle blocks alongside frontmatter and inline properties
5. **Document conventions**: Establish team conventions for turtle block usage

This powerful feature allows you to seamlessly blend human-readable documentation with machine-processable semantic data.