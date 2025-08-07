# Syntax Reference

Reference for vault-triplifier syntax and how it generates RDF triples.

## How Triples Are Formed

Vault-triplifier converts markdown to RDF using three syntaxes:

### 1. Block Properties

```markdown
# Alice

age :: 25
occupation :: student
```

**Generates:** `<current-section> <urn:property:age> "25"`

### 2. Inline Properties

```markdown
Alice (age :: 25) is a (occupation :: student).
```

**Generates:** Same as block properties - attaches to current section.

### 3. Explicit Triples

**For Named Entity Subjects:**

```markdown
[[Alice]] :: age :: 25
[[Alice]] :: knows :: [[Bob]]
```

**Generates:** `<urn:name:Alice> <urn:property:age> "25"`

**For Property Namespace Subjects:**

```markdown
Alice :: age :: 25
Alice :: knows :: [[Bob]]
```

**Generates:** `<urn:property:Alice> <urn:property:age> "25"`

**Rule:** Use `[[Subject]]` for named entities, `Subject` for property namespace.

## Subject-Predicate-Object Rules

- **Subject:** Determined by partitioning and syntax
- **Predicate:** Properties become `<urn:property:encoded-name>`
- **Object:** Text becomes literals, `[[Name]]` becomes `<urn:name:Name>`

## Subject Selection by Partitioning

### No Partitioning (`partitionBy: []`)

```markdown
# Alice

age :: 25

## Bob

age :: 27
```

**Result:** Both properties attach to document: `<urn:name:filename>`

### Header Partitioning (`partitionBy: ['headers-h1-h2']`)

```markdown
# Alice

age :: 25 ← <urn:name:filename#Alice>

## Bob

age :: 27 ← <urn:name:filename#Bob>
```

### Explicit Subjects

```markdown
[[Alice]] :: age :: 25 ← <urn:name:Alice>
[[Bob]] :: age :: 27 ← <urn:name:Bob>
```

## Value Types

### Literals (Strings)

```markdown
name :: Alice Wonderland → "Alice Wonderland"
age :: 25 → "25" (currently string, not integer)
file :: file:///path/to/file → "file:///path/to/file"
ftp :: ftp://server.com → "ftp://server.com"
```

### URIs

```markdown
# Named concepts (wiki links)

knows :: [[Alice]] → <urn:name:Alice>
lives in :: [[Wonderland]] → <urn:name:Wonderland>

# Web URIs

website :: https://example.com → <https://example.com>
email :: mailto:alice@test.com → <mailto:alice@test.com>
```

**Rule:** `[[Name]]` creates named concept URIs. `http://`, `https://`, and `mailto:` URIs are detected automatically.
Other URI schemes become literals.

## Property Naming

Properties become URIs in the `urn:property:` namespace:

```markdown
age :: 25 → <urn:property:age>
full name :: Alice → <urn:property:full%20name>
schema:age :: 25 → <http://schema.org/age> (with namespace config)
```

**Encoding:** Spaces become `%20`, special characters are URI-encoded.

## Namespace Configuration

### Built-in Prefixes

Default prefixes available without configuration:

```markdown
schema:name :: Alice → <http://schema.org/name>
foaf:knows :: [[Bob]] → <http://xmlns.com/foaf/0.1/knows>
dc:title :: My Document → <http://purl.org/dc/terms/title>
rdf:type :: schema:Person → <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
```

### Custom Prefixes

Configure in options:

```javascript
{
  prefix: {
    "custom"
  :
    "http://example.org/vocab#",
      "project"
  :
    "http://mycompany.com/terms#"
  }
}
```

Use in documents:

```markdown
custom:category :: important
project:status :: active
```

## Property Mappings

### Default Mappings

Built-in property mappings:

```markdown
is a :: Person → <rdf:type> "Person"
same as :: [[Alice]] → <rdfs:sameAs> <urn:name:Alice>
```

### Custom Mappings

```javascript
{
  mappings: {
    "related to"
  :
    "rdfs:seeAlso",
      "instance of"
  :
    "rdf:type"
  }
}
```

Usage:

```markdown
related to :: [[Concept]]
instance of :: schema:Person
```

## Link Syntax

### Wiki Links

**External Links** (to other documents/entities):

```markdown
knows :: [[Bob]] → <urn:name:Bob>
lives in :: [[Wonderland]] → <urn:name:Wonderland>
works at :: [[Oxford University]] → <urn:name:Oxford-University>
```

**Internal Links** (to sections within same document):

```markdown
# Team Directory

## Alice Johnson

reports to :: [[#Bob Smith]]

## Bob Smith

manages :: [[#Alice Johnson]]
```

**Generates:**

```turtle

<urn:name:team-directory#Alice%20Johnson>
    <urn:property:reports%20to> <urn:name:team-directory#Bob%20Smith> .

<urn:name:team-directory#Bob%20Smith>
    <urn:property:manages> <urn:name:team-directory#Alice%20Johnson> .
```

**Rule:** Use `[[#Section Name]]` for internal document links, `[[Entity Name]]` for external entities.

### External URLs

```markdown
# Auto-detected as URIs

website :: https://example.com → <https://example.com>
homepage :: http://example.com → <http://example.com>
email :: mailto:alice@test.com → <mailto:alice@test.com>

# Other schemes become literals

phone :: tel:+1234567890 → "tel:+1234567890"
file :: file:///path/to/file → "file:///path/to/file"
ftp :: ftp://server.com → "ftp://server.com"
```

## Partitioning Options

Controls which entities become subjects:

```javascript
{
  partitionBy: [
    "headers-h1-h2", // Split on # and ##
    "headers-h2-h3", // Split on ## and ### (default)
    "headers-h1-h2-h3", // Split on #, ##, ###
    "headers-all", // Split on all headers
  ];
}
```

### Examples

#### Header Partitioning

```markdown
# Alice

age :: 25 ← attaches to <urn:name:doc#Alice>

## Details

height :: 165 ← attaches to <urn:name:doc#Details>
```

#### Custom URI Support in Header Partitions

When using header-based partitioning, you can override the default URI generation by explicitly declaring a custom URI:

```markdown
# Team Directory

## Alice Johnson

schema:jobTitle :: Product Manager
uri :: <https://company.com/employees/alice>

## Bob Smith

schema:jobTitle :: Senior Developer
uri :: urn:employee:bob-smith
```

**Generates:**

```turtle

<https://company.com/employees/alice>
    <http://schema.org/jobTitle> "Product Manager" .

<urn:employee:bob-smith>
    <http://schema.org/jobTitle> "Senior Developer" .
```

⚠️ Note on Consistency

This feature allows full control over URIs, but may introduce inconsistencies when linking to specific headers from external notes. In such cases, you may need to explicitly assert identity using owl:sameAs or similar constructs. Use with care.

**Custom URI Rules:**

- Use `uri :: <URI>` or `uri :: URI` syntax within header sections
- Supports HTTP/HTTPS URLs, URNs, and other URI schemes
- Both delimited (`<URI>`) and plain (`URI`) formats are valid
- The `uri` property is reserved and won't create RDF triples
- If no custom URI is provided, the default pattern is applied

## Frontmatter Integration

YAML frontmatter becomes properties on the document:

```yaml
---
title: My Document
author: John Doe
tags: [ example, demo ]
---
```

**Generates:** Properties attached to the file entity, NOT configuration overrides.

## Multiple Values

### Comma-Separated Values

```markdown
languages :: English, French, Spanish
```

**Generates:** One triple with the full string as literal: `"English, French, Spanish"`

### Repeated Properties

```markdown
knows :: [[Alice]]
knows :: [[Bob]]
knows :: [[Charlie]]
```

**Generates:** Three separate triples.

## Special Syntax

### Inline with Context

```markdown
Alice (age :: 25) (knows :: [[Bob]]) walked to the store.
```

**Generates:** Properties attach to current section, not to "Alice" entity.

### Comments (Ignored)

```markdown
<!-- This comment is ignored -->

age :: 25 <!-- This comment is also ignored -->
```

### Escaping

```markdown
property\:\:name :: value with\:\:colons
text :: This has \[\[brackets\]\] but no link
```

## Common Patterns

### Character Profiles

```markdown
# Alice

is a :: Person
age :: 25
knows :: [[Bob]], [[Mad Hatter]]
```

### Explicit Relationships

```markdown
[[Alice]] :: friend of :: [[Bob]]
[[Bob]] :: colleague of :: [[Alice]]
```

### Mixed Syntax

```markdown
# Characters

Alice (age :: 25) is the protagonist.

# Additional details

hometown :: Oxford
university :: [[Oxford University]]
```

## Common Patterns

### Person Profiles

```markdown
# Team

## Alice

schema:name :: Alice Johnson
schema:jobTitle :: Product Manager
schema:email :: alice@company.com
reports to :: [[Director of Product]]
manages :: [[Bob]], [[Charlie]]
expertise :: user research, roadmap planning
```

### Project Documentation

```markdown
# Search Enhancement Project

## Overview

status :: in progress
start date :: 2024-01-15
deadline :: 2024-06-01
budget :: $150000

## Team

lead :: [[Alice]]
developers :: [[Bob]], [[Charlie]]
designer :: [[Dana]]
```

### Meeting Notes

```markdown
# Sprint Planning

## Session Info

date :: 2024-03-15
duration :: 2 hours
facilitator :: [[Alice]]

Alice (role :: facilitator) opened the session. Bob (concern :: API performance)
raised issues with the authentication service (response time :: 2.3 seconds).

## Decisions

decision :: optimize database queries
assigned to :: [[Bob]]
due date :: 2024-03-22
```

This reference covers the core syntax for generating RDF triples. For configuration details,
see [Configuration Guide](configuration.md).
