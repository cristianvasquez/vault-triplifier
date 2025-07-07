# Frontmatter Integration

Combine YAML frontmatter metadata with semantic properties for powerful document organization and automated knowledge extraction.

## YAML Frontmatter Basics

Frontmatter appears at the beginning of documents between `---` markers:

```markdown
---
title: Alice's Adventure
author: Lewis Carroll
date: 1865-11-26
tags: [fiction, children, fantasy]
---

# Alice's Adventure

The story begins when Alice sees a White Rabbit...

character :: Alice
setting :: [[Wonderland]]
```

## Standard Frontmatter Properties

Common YAML frontmatter properties get automatically mapped to semantic vocabularies:

```markdown
---
title: Down the Rabbit Hole
author: Lewis Carroll
date: 1865-11-26
description: Alice follows a rabbit down a hole
tags: [adventure, fantasy, children]
language: en
type: chapter
---

# Chapter Content
The frontmatter creates schema.org properties automatically.
```

Generates:
```turtle
<document> <http://schema.org/name> "Down the Rabbit Hole" ;
    <http://schema.org/author> "Lewis Carroll" ;
    <http://schema.org/dateCreated> "1865-11-26" ;
    <http://schema.org/description> "Alice follows a rabbit down a hole" .
```

## Semantic Frontmatter

Use semantic namespaces directly in frontmatter:

```markdown
---
schema:name: Alice Wonderland
schema:birthDate: 1998-03-15
schema:email: alice@wonderland.com
foaf:knows: [Bob, Mad Hatter]
schema:worksFor: Oxford University
wonderland:magicalAbility: size-changing
---

# Alice's Profile

Alice is a curious student who fell down a rabbit hole.

age :: 25
studies :: philosophy
```

## Complex Frontmatter Structures

YAML supports nested structures for complex relationships:

```markdown
---
character:
  name: Alice Wonderland
  age: 25
  contact:
    email: alice@example.com
    phone: "+44-123-456-7890"
  address:
    street: 123 Wonderland Lane
    city: Oxford
    country: England
  relationships:
    knows: [Bob, Mad Hatter, White Rabbit]
    studies_with: Professor Smith
    lives_near: White Rabbit
---

# Character Profile

Alice is defined through both frontmatter structure and inline properties.

current activity :: chasing rabbits
mood :: curious
```

## Mixed Metadata Strategies

Combine frontmatter for structured data with inline properties for narrative content:

```markdown
---
# Document metadata
title: The Tea Party
date: 2024-03-15
event_type: social gathering
participants: [Alice, Mad Hatter, March Hare]
location: Wonderland
schema:startTime: "15:00"
schema:endTime: "17:00"
---

# The Mad Tea Party

Alice approached the tea party (nervously :: true) where the Mad Hatter 
(role :: host) (personality :: eccentric) was serving tea (temperature :: cold) 
to the March Hare (species :: hare) (mood :: excited).

# Event details from narrative
conversation topics :: riddles, unbirthdays
tea quality :: terrible
alice reaction :: confused
hatter behavior :: nonsensical
```

## Frontmatter for Document Organization

Use frontmatter to organize documents in collections:

```markdown
---
collection: Characters
series: Alice in Wonderland
character_type: protagonist
first_appearance: Chapter 1
last_appearance: Chapter 12
story_role: hero
character_arc: coming of age
---

# Alice

Alice begins as a bored child but grows into an adventurous young woman.

initial state :: bored
transformation :: curious explorer
final state :: confident
```

## Taxonomies and Classification

Create taxonomic structures with frontmatter:

```markdown
---
# Biological classification
kingdom: Animalia
phylum: Chordata
class: Mammalia
order: Lagomorpha
family: Leporidae
genus: Oryctolagus
species: cuniculus

# Story classification  
story_element: character
character_type: guide
narrative_function: catalyst
archetype: herald
---

# White Rabbit

The White Rabbit serves as the herald who calls Alice to adventure.

personality :: anxious
famous phrase :: "I'm late!"
accessory :: pocket watch
role in story :: guide
```

## Multi-Language Support

Handle multilingual content with frontmatter:

```markdown
---
title:
  en: Alice's Adventures in Wonderland  
  es: Las Aventuras de Alicia en el País de las Maravillas
  fr: Les Aventures d'Alice au Pays des Merveilles
author: Lewis Carroll
language: en
translations:
  - language: es
    translator: Luis Maristany
  - language: fr  
    translator: Henri Bué
---

# Alice's Adventures

A tale of a curious girl who falls down a rabbit hole.

original language :: English
publication year :: 1865
cultural impact :: worldwide
```

## Version Control and Provenance

Track document history and changes:

```markdown
---
version: 2.1.3
created: 2024-01-15
modified: 2024-03-15
last_editor: Alice
revision_notes: Added character relationships
source: original manuscript
status: draft
review_status: pending
schema:dateCreated: 2024-01-15T10:30:00Z
schema:dateModified: 2024-03-15T14:22:00Z
---

# Document with Versioning

This document tracks its own evolution through frontmatter.

current focus :: character development
next revision :: plot refinement
```

## Validation and Quality Control

Add validation rules in frontmatter:

```markdown
---
required_fields: [title, author, date]
validation_rules:
  - field: date
    type: date
    format: YYYY-MM-DD
  - field: tags
    type: array
    min_items: 1
quality_checks:
  spelling: passed
  grammar: pending
  fact_check: required
---

# Quality-Controlled Document

This document uses frontmatter for quality assurance.
```

## Integration with External Systems

Connect to external databases and APIs:

```markdown
---
# External identifiers
isbn: 978-0-14-143761-6
doi: 10.1000/182
wikidata_id: Q182538
goodreads_id: 24213
library_catalog: ox:12345

# API integration
sync_with: [Goodreads, WorldCat, Wikipedia]
last_sync: 2024-03-15T09:00:00Z
external_updates: pending

# Database references
database_id: alice_chars_001
parent_collection: wonderland_universe
related_entities: [bob_001, hatter_002, rabbit_003]
---

# Externally Connected Document

This document maintains connections to external systems.
```

## Computed and Dynamic Properties

Some frontmatter can be computed from content:

```markdown
---
# Static metadata
title: Alice Character Analysis
author: Research Team

# Computed metadata (calculated by tools)
word_count: 1247
reading_time: 5 minutes
last_updated: auto
semantic_density: high
relationship_count: 15
mention_frequency:
  alice: 47
  wonderland: 23
  rabbit: 15
---

# Analyzed Document

Tools can automatically populate computed frontmatter fields.
```

## Template-Based Generation

Use frontmatter templates for consistency:

```markdown
---
# Character template
template: character_profile
required_fields: [name, first_appearance, role]

# Character-specific data
name: Cheshire Cat
first_appearance: Chapter 6
role: advisor
species: cat
special_ability: disappearing
personality_traits: [mysterious, philosophical, mischievous]
memorable_quotes: ["We're all mad here"]
---

# Character Generated from Template

Template-based documents ensure consistent structure.
```

## Conditional Content

Use frontmatter to control content display:

```markdown
---
audience: children
content_warnings: none
difficulty_level: beginner
show_advanced_concepts: false
include_analysis: false
format: story
---

# Audience-Appropriate Content

{% if frontmatter.show_advanced_concepts %}
## Advanced Literary Analysis
This would only appear for advanced audiences.
{% endif %}

Alice's adventure teaches us about curiosity and courage.

# Simple properties for young readers
lesson :: be curious
moral :: courage helps
main character :: Alice
```

## Automation and Workflows

Frontmatter can trigger automated processing:

```markdown
---
# Workflow triggers
auto_publish: true
notify_subscribers: true
generate_summary: true
update_index: true
create_relationships: true

# Processing instructions
extract_entities: [person, place, organization]
generate_tags: true
suggest_links: true
quality_check: true

# Output formats
export_formats: [html, pdf, epub]
include_metadata: true
---

# Automated Document

This document triggers various automated processes through frontmatter.
```

## Best Practices

### 1. Separate Concerns
```markdown
---
# Document metadata in frontmatter
title: Alice Profile
type: character
collection: wonderland

# Semantic relationships in body  
schema:worksFor: Oxford
schema:address: wonderland
---

# Content with inline semantics
Alice (age :: 25) lives in Oxford but dreams of (place :: [[Wonderland]]).
```

### 2. Use Standard Fields
```markdown
---
# Standard fields work everywhere
title: Document Title
author: Author Name
date: 2024-03-15
tags: [tag1, tag2]

# Custom fields for specific needs
character_type: protagonist
story_arc: hero_journey
---
```

### 3. Keep It Readable
```markdown
---
# Good - clear and organized
title: Alice's Profile
character:
  name: Alice Wonderland
  age: 25
  occupation: student

# Avoid - overly complex nesting
character:
  basic:
    identity:
      primary:
        name:
          first: Alice
          last: Wonderland
---
```

## What Gets Generated

Frontmatter properties automatically become RDF triples:

```markdown
---
title: Alice's Story
author: Lewis Carroll
schema:dateCreated: 1865-11-26
foaf:knows: [Bob, Mad Hatter]
---
```

Generates:
```turtle
<document> <http://schema.org/name> "Alice's Story" ;
    <http://schema.org/author> "Lewis Carroll" ;
    <http://schema.org/dateCreated> "1865-11-26" ;
    <http://xmlns.com/foaf/0.1/knows> <file:///Bob> ;
    <http://xmlns.com/foaf/0.1/knows> <file:///Mad_Hatter> .
```

## Next Steps

With frontmatter integration complete, you now have all the tools needed to create rich, semantic documents. Explore the [Syntax Reference](../syntax-reference.md) for complete details on all available features.

## Practice Exercise

Create a comprehensive document using both frontmatter and inline semantics:

```markdown
---
title: [Document Title]
author: [Your Name]
date: [Today's Date]
schema:type: [Document Type]
tags: [relevant, tags]
character:
  name: [Character Name]
  role: [Character Role]
---

# [Document Title]

[Character] (age :: ?) (occupation :: ?) lives in (location :: [[?]]) 
where they (activity :: ?) and (relationship :: ?) with [[?]].

# Document properties  
theme :: [theme]
setting :: [setting]
genre :: [genre]
```

Create rich, structured knowledge that bridges human-readable content with machine-processable semantics!