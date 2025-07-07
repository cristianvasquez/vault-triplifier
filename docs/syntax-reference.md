# Syntax Reference

Complete reference for all vault-triplifier syntax patterns, properties, and configuration options.

## Basic Property Syntax

### Simple Properties
```markdown
property :: value
name :: Alice
age :: 25
location :: Wonderland
```

### Multiple Values
```markdown
# Separate lines
knows :: Bob
knows :: Mad Hatter
knows :: White Rabbit

# Comma-separated list
friends :: Bob, Mad Hatter, White Rabbit

# Array syntax (in frontmatter)
tags: [adventure, fantasy, children]
```

### Property Names
- **Allowed characters**: letters, numbers, hyphens, underscores, spaces
- **Case sensitive**: `Name` ≠ `name`
- **Spaces allowed**: `favorite color :: blue`
- **Unicode supported**: `名前 :: Alice`

```markdown
# Valid property names
name :: Alice
first-name :: Alice
first_name :: Alice
favorite color :: blue
名前 :: Alice Wonderland
```

## Namespace Syntax

### Built-in Namespaces
```markdown
# Schema.org
schema:name :: Alice Wonderland
schema:email :: alice@example.com
schema:birthDate :: 1998-03-15

# Friend of a Friend
foaf:name :: Alice
foaf:knows :: Bob
foaf:homepage :: https://alice.example.com

# Dublin Core
dc:title :: Alice's Adventures
dc:creator :: Lewis Carroll
dc:date :: 1865-11-26

# RDF/RDFS/OWL
rdf:type :: schema:Person
rdfs:label :: Alice Wonderland
owl:sameAs :: https://example.com/alice
```

### Custom Namespaces
Configure in options:
```javascript
{
  namespaces: {
    "wonderland": "http://wonderland.example.org/vocab#",
    "story": "http://narrative.example.org/terms#"
  }
}
```

Use in documents:
```markdown
wonderland:magicalAbility :: size-changing
story:characterRole :: protagonist
```

## Link Syntax

### Wiki Links
```markdown
# Document links
knows :: [[Bob]]
lives in :: [[Wonderland]]
works at :: [[Oxford University]]

# Section links
setting :: [[#Wonderland]]
reference :: [[Document#Section]]
climax :: [[Story#Chapter 5#The Reveal]]
```

### External URLs
```markdown
# Web links
website :: https://alice-wonderland.com
reference :: https://en.wikipedia.org/wiki/Alice
social :: https://twitter.com/alice_w

# Special protocols
email :: mailto:alice@example.com
phone :: tel:+1-555-0123
location :: geo:51.7520,-1.2577
```

### Markdown Links
```markdown
# Standard markdown links
university :: [Oxford](https://ox.ac.uk)
author :: [Lewis Carroll](https://en.wikipedia.org/wiki/Lewis_Carroll)
book :: [Alice's Adventures](https://gutenberg.org/alice)
```

## Inline Syntax

### Basic Inline Properties
```markdown
Alice (age :: 25) lives in (location :: [[Oxford]]) where she 
(studies :: philosophy) and (knows :: [[Bob]]).
```

### Multiple Inline Properties
```markdown
The White Rabbit (species :: rabbit) (color :: white) (accessory :: pocket watch) 
(personality :: anxious) ran past Alice (reaction :: surprised).
```

### Mixed Inline and Block
```markdown
Alice (age :: 25) is a student at Oxford.

# Block properties
full name :: Alice Wonderland
university :: [[Oxford University]]
degree :: Philosophy

She met the Mad Hatter (occupation :: hat maker) (personality :: eccentric) 
at a tea party (time :: 3:00 PM) (location :: [[Wonderland]]).
```

## Value Types

### Strings
```markdown
name :: Alice Wonderland
description :: A curious student
quote :: "We're all mad here"
```

### Numbers
```markdown
age :: 25
height :: 5.5
temperature :: -10
percentage :: 95.5
```

### Dates and Times
```markdown
# ISO 8601 format
birth date :: 1998-03-15
timestamp :: 2024-03-15T14:30:00Z
time :: 15:30:00

# Natural formats (converted to ISO)
published :: March 15, 1998
event :: 2024-03-15
```

### Booleans
```markdown
is student :: true
is fictional :: false
married :: yes
completed :: no
```

### Lists and Arrays
```markdown
# Comma-separated
languages :: English, French, Latin
colors :: red, blue, green

# YAML array (frontmatter)
skills: [reading, writing, logic]
interests: [philosophy, adventure, puzzles]
```

### Structured Values
```markdown
# Object notation
address :: {
  street :: 123 Wonderland Lane
  city :: Oxford
  country :: England
  postal code :: OX1 2AB
}

# Or flat structure
street address :: 123 Wonderland Lane
city :: Oxford
postal code :: OX1 2AB
```

## Subject-Predicate-Object Syntax

### Explicit Triples
```markdown
# Pattern: Subject :: predicate :: Object
Alice :: knows :: Bob
White Rabbit :: leads :: Alice
Oxford :: has employee :: Alice

# With namespaces
Alice :: schema:spouse :: Bob
Person :: rdfs:subClassOf :: schema:Thing
Alice :: rdf:type :: Student
```

### Relationship Declarations
```markdown
# Bidirectional relationships
Alice :: friend of :: Bob
Bob :: friend of :: Alice

# Inverse relationships
Professor :: teaches :: Alice
Alice :: student of :: Professor

# Complex relationships
Alice :: met :: Bob {
  when :: 2020-09-15
  where :: Oxford
  context :: university
}
```

## Frontmatter Integration

### YAML Frontmatter
```yaml
---
title: Alice's Profile
author: Lewis Carroll
date: 1865-11-26
tags: [fiction, children, fantasy]
schema:name: Alice Wonderland
schema:birthDate: 1998-03-15
foaf:knows: [Bob, Mad Hatter]
---
```

### Nested Structures
```yaml
---
character:
  name: Alice Wonderland
  age: 25
  contact:
    email: alice@example.com
    phone: "+44-123-456-7890"
  relationships:
    knows: [Bob, Mad Hatter]
    studies_with: Professor Smith
---
```

### Mixed YAML and Markdown
```markdown
---
title: Character Profile
type: person
---

# Alice

Alice (schema:age :: 25) lives in Oxford.

# Additional details from markdown
current activity :: studying
favorite subject :: philosophy
```

## Partitioning Syntax

### Identifier Anchors
```markdown
# Story content

Alice walked through the forest.

^alice-intro

Alice is a curious girl.
character :: Alice
personality :: curious

She met a rabbit.

^rabbit-encounter

The rabbit wore a pocket watch.
character :: White Rabbit
accessory :: pocket watch
```

### Tag Sections
```markdown
# Story

Alice was walking when she noticed something.

#character-introduction

Alice is twenty-five years old.
character :: Alice
age :: 25

#rabbit-encounter

A white rabbit ran past.
character :: White Rabbit
behavior :: running
```

### Header Partitioning
```markdown
# Document (entity)
author :: Lewis Carroll

## Chapter 1 (entity with headers-h1-h2)
title :: Down the Rabbit Hole
setting :: Oxford

### Scene 1 (part of Chapter 1 with headers-h1-h2)
action :: Alice reads
location :: riverbank

### Scene 2 (part of Chapter 1 with headers-h1-h2)  
action :: Following rabbit
location :: rabbit hole

## Chapter 2 (entity with headers-h1-h2)
title :: The Pool of Tears
```

## Comments and Annotations

### Comments (Ignored)
```markdown
<!-- This is a comment and won't become RDF -->

# Alice
name :: Alice Wonderland  <!-- This comment is ignored -->
age :: 25

// This line comment is also ignored
knows :: [[Bob]]
```

### Annotation Syntax
```markdown
# Alice

Alice has many interesting qualities.

<!-- annotation: This describes Alice's personality -->
personality :: curious, brave, kind

<!-- note: Added in version 2.1 -->
last updated :: 2024-03-15
```

## Configuration Reference

### Basic Options
```javascript
{
  // Partitioning strategy
  partitionBy: ['identifier', 'headers-h1-h2'],
  
  // Base URI for generated resources
  baseIRI: 'file:///',
  
  // Include text positions (selectors)
  includeSelectors: true,
  
  // Default namespaces
  useDefaultNamespaces: true
}
```

### Namespace Configuration
```javascript
{
  namespaces: {
    "schema": "http://schema.org/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "dc": "http://purl.org/dc/terms/",
    "custom": "http://example.org/vocab#"
  }
}
```

### Property Mappings
```javascript
{
  mappings: [
    {
      type: "inlineProperty",
      key: "is a",
      predicate: "rdf:type"
    },
    {
      type: "inlineProperty", 
      key: "same as",
      predicate: "owl:sameAs"
    }
  ]
}
```

### Partition Options
```javascript
{
  partitionBy: [
    'none',           // No partitioning (default)
    'identifier',     // Split on ^anchor
    'tag',           // Split on #tag
    'headers-h1-h2', // Split on H1 and H2
    'headers-h1-h2-h3', // Split on H1, H2, H3
    'headers-all'    // Split on all headers
  ]
}
```

## Special Syntax

### Escape Characters
```markdown
# Escaping colons
property\:\:name :: value with\:\:colons
text :: This has a \:\: double colon

# Escaping brackets  
link :: \[\[Not a link\]\]
text :: This has \[\[brackets\]\] but no link
```

### Reserved Keywords
```markdown
# These have special meaning in some contexts
rdf:type :: schema:Person
rdfs:label :: Alice Wonderland
owl:sameAs :: https://example.com/alice
```

### Case Sensitivity
```markdown
# Different properties
Name :: Alice
name :: alice
NAME :: ALICE

# Same namespace, different case
schema:Name :: Alice (not standard)
schema:name :: Alice (correct)
```

## Validation Rules

### Property Names
- Must contain at least one character
- Cannot start or end with whitespace
- Cannot contain `::` (reserved for separator)
- Cannot contain `[[` or `]]` (reserved for links)

### Values
- String values can contain any characters
- Links must be properly formatted: `[[target]]` or `[text](url)`
- Numbers must be valid: integers, decimals, scientific notation
- Dates should be ISO 8601 format for best compatibility

### Namespaces
- Prefix must be valid XML name
- Cannot contain `:` (reserved for namespace separator)
- Must be defined in configuration or built-in

## Error Handling

### Common Syntax Errors
```markdown
# Missing space after ::
property::value  # ERROR: needs space
property :: value  # CORRECT

# Multiple :: in value
property :: value::with::colons  # May be confusing
property :: value\:\:with\:\:colons  # CORRECT: escaped

# Incomplete links
knows :: [[Bob  # ERROR: missing closing ]]
knows :: [[Bob]]  # CORRECT

# Invalid dates
date :: not-a-date  # WARNING: treated as string
date :: 2024-03-15  # CORRECT: ISO format
```

### Recovery Behavior
- Invalid syntax is typically treated as literal text
- Malformed links become plain text
- Invalid dates become string literals
- Unknown namespaces create warning but continue processing

## Performance Considerations

### Large Documents
- Excessive partitioning can create many small entities
- Very deep nesting may impact performance
- Large inline property lists can be hard to read

### Optimization Tips
```markdown
# Good: balanced partitioning
# Headers for major sections
## Chapter 1
^important-concept  # Identifiers for key concepts

# Avoid: excessive partitioning
#### Every
##### Small
###### Section
^tiny-concept
#every-sentence
```

## Best Practices Summary

1. **Use standard namespaces** when possible
2. **Be consistent** with property naming
3. **Balance readability** with semantic richness
4. **Choose appropriate partitioning** for your use case
5. **Validate your output** to ensure correct RDF generation
6. **Document your conventions** for team collaboration

This reference covers all syntax patterns supported by vault-triplifier. See the [examples](examples/) for practical usage patterns and [configuration guide](configuration.md) for detailed setup options.