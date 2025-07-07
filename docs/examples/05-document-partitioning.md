# Document Partitioning

Control how documents are divided into semantic sections using headers, tags, and anchors to create precise, granular knowledge graphs.

## What is Partitioning?

Partitioning determines how your document gets divided into separate RDF subjects. Each partition becomes its own "thing" in the knowledge graph with its own URI and properties.

```markdown
# Without Partitioning (default)
# Everything becomes properties of the document

# Alice's Story
age :: 25
knows :: [[Bob]]

## Chapter 1
setting :: [[Wonderland]]
character :: Alice

# With Header Partitioning  
# Each header section becomes a separate entity

# Alice's Story (document entity)
author :: Lewis Carroll

## Chapter 1 (separate entity) 
setting :: [[Wonderland]]
character :: Alice
```

## Partition Strategies

### None (Default)
All properties attach to the document:

```markdown
# My Document
type :: Story
author :: Me

## Section 1
content :: Chapter content
character :: Alice

## Section 2  
content :: More content
setting :: Wonderland

# All properties attach to "My Document"
```

### Headers H1-H2 Only
Split only on level 1 and 2 headers:

```markdown
# Main Title (becomes entity)
document type :: Book

## Chapter 1 (becomes entity)
title :: Down the Rabbit Hole
character :: Alice
setting :: Oxford

### Scene 1 (stays part of Chapter 1)
action :: Alice reads
location :: riverbank

### Scene 2 (stays part of Chapter 1)  
action :: Alice follows rabbit
location :: rabbit hole

## Chapter 2 (becomes entity)
title :: The Pool of Tears
character :: Alice
setting :: Wonderland
```

### Headers H1-H2-H3
Split on levels 1, 2, and 3:

```markdown
# Book (entity)
author :: Lewis Carroll

## Chapter 1 (entity)
title :: Down the Rabbit Hole

### Scene 1 (entity)
action :: Reading by river
character :: Alice
props :: book

### Scene 2 (entity)
action :: Following rabbit  
character :: Alice, White Rabbit
location :: rabbit hole

## Chapter 2 (entity)
title :: The Pool of Tears
```

### Headers All
Split on every header level:

```markdown
# Title (entity)
## Chapter (entity)  
### Scene (entity)
#### Moment (entity)
##### Detail (entity)
###### Note (entity)
```

## Identifier Anchors

Create semantic entities using identifier anchors with `^identifier`:

```markdown
# Story

Alice walked through the forest.

^alice-intro

Alice is a curious girl who loves adventures.

character name :: Alice
personality :: curious
interests :: adventures

She met a rabbit.

^rabbit-encounter

The rabbit was wearing a pocket watch.

encounter type :: first meeting
rabbit feature :: pocket watch
alice reaction :: surprise
```

Each `^identifier` creates a new entity in the knowledge graph.

## Tag-Based Partitioning

Use hashtags to create semantic sections:

```markdown
# Story

Alice was walking when she saw something unusual.

#character-introduction

Alice is twenty-five years old and studies at Oxford.

character :: Alice
age :: 25
university :: [[Oxford]]
field :: Philosophy

#rabbit-encounter

A white rabbit ran past wearing a pocket watch.

character :: White Rabbit
appearance :: white
accessory :: pocket watch
behavior :: running late
```

Each `#tag` section becomes its own entity.

## Combined Partitioning

Use multiple partition strategies together:

```markdown
# Alice's Adventures (document entity)
author :: Lewis Carroll
publication year :: 1865

## Chapter 1: Down the Rabbit Hole (chapter entity)
setting :: Oxford riverbank

^alice-reading

Alice was getting tired of sitting by her sister.

activity :: reading
emotion :: bored
companion :: sister

#philosophical-moment

She was considering whether the pleasure of making a daisy-chain 
would be worth the trouble of getting up.

thought type :: philosophical
decision :: whether to make daisy chain
current state :: sitting
effort required :: getting up

^rabbit-appearance  

A White Rabbit with pink eyes ran close by her.

character :: White Rabbit
eye color :: pink
action :: running
proximity :: close by

#surprise-moment

Alice thought this was not so remarkable until the Rabbit 
took a watch out of its waistcoat pocket.

alice emotion :: not surprised initially
rabbit action :: checking watch
remarkable feature :: rabbit has waistcoat
turning point :: watch revelation
```

This creates entities for:
- The document (`Alice's Adventures`)
- The chapter (`Chapter 1`)
- Each identifier (`alice-reading`, `rabbit-appearance`)  
- Each tag section (`philosophical-moment`, `surprise-moment`)

## Partition Configuration

Configure partitioning with options:

```javascript
// Partition by headers H1-H2 and identifiers
{
  partitionBy: ['headers-h1-h2', 'identifier']
}

// Partition by all headers and tags
{
  partitionBy: ['headers-all', 'tag']
}

// Partition by identifiers only
{
  partitionBy: ['identifier']
}

// No partitioning (everything to document)
{
  partitionBy: []
}
```

## When to Use Each Strategy

### Headers-H1-H2 (Recommended for most documents)
Good for:
- Books with chapters and sections
- Articles with main sections
- Documentation with major topics

```markdown
# User Guide (document)
version :: 2.1

## Getting Started (section entity)
difficulty :: beginner
estimated time :: 30 minutes

## Advanced Features (section entity)  
difficulty :: expert
estimated time :: 2 hours
```

### Identifier Anchors
Good for:
- Precise concept definitions
- Detailed annotations
- Fine-grained relationships
- Cross-references

```markdown
# Research Paper

The concept of emergence is important.

^emergence-definition

Emergence refers to complex systems developing properties 
not present in individual components.

concept :: emergence
field :: systems theory
characteristic :: irreducible complexity
examples :: [[consciousness]], [[life]]
```

### Tag-Based
Good for:
- Thematic organization
- Mood or emotion tracking
- Classification systems
- Multiple overlapping topics

```markdown
# Daily Journal

Today was interesting.

#morning-routine
woke up :: 7:00 AM
mood :: energetic
weather :: sunny

#work-updates  
project :: data analysis
progress :: 75% complete
challenges :: missing data

#evening-reflection
accomplishments :: finished report
mood :: satisfied
plans :: tomorrow's presentation
```

### Combined Strategies
Good for:
- Complex documents with multiple organizational schemes
- Academic papers with detailed citations
- Narrative works with character tracking
- Technical documentation with examples

## Granularity Considerations

### Too Little Partitioning
```markdown
# Entire Document (one big entity)
Everything becomes one giant entity with dozens of properties
- Hard to query specific concepts
- Relationships get muddled
- Poor for detailed analysis
```

### Balanced Partitioning
```markdown
# Document (main entity)
title :: My Research

## Introduction (section entity)
focus :: problem statement
length :: 2 pages

## Methods (section entity)
approach :: experimental
duration :: 6 months

^key-finding
The most important discovery was X.
significance :: breakthrough
impact :: high
```

### Too Much Partitioning
```markdown
# Every sentence becomes its own entity
- Creates too many tiny entities
- Relationships become fragmented  
- Harder to see bigger picture
- Performance impact
```

## Property Attachment Rules

Properties attach to the nearest partition boundary:

```markdown
# Document
doc property :: attaches to document

## Section  
section property :: attaches to section

Content about Alice.
content property :: attaches to section

^identifier
identifier property :: attaches to identifier entity

More content.
more property :: still attaches to identifier entity

#tag
tag property :: attaches to tag entity

Final content.
final property :: attaches to tag entity
```

## Cross-Partition References

Link between different partitions:

```markdown
# Story
characters :: [[#alice-intro]], [[#rabbit-intro]]

## Chapter 1

^alice-intro
Alice is the protagonist.
role :: protagonist  
appears in :: [[#rabbit-encounter]]

^rabbit-encounter  
Alice meets the White Rabbit.
participants :: [[#alice-intro]], [[#rabbit-intro]]

^rabbit-intro
The White Rabbit is always late.
role :: catalyst
first appears :: [[#rabbit-encounter]]
```

## Position Selectors

With partitioning, you get precise text selectors for each entity:

```markdown
# Document (position 0-50)
## Section (position 20-100)  
^anchor (position 60-120)
#tag (position 90-150)
```

This allows applications to:
- Highlight exact text spans
- Navigate to specific content
- Create precise annotations
- Build interactive visualizations

## Next Steps

Learn about [Advanced Mappings](06-advanced-mappings.md) to create complex relationships and custom term mappings.

## Practice Exercise

Try different partitioning strategies on this content:

```markdown
# My Day

I woke up early and had breakfast.

## Morning Activities
I went for a run in the park.

^run-details
The run was 5 kilometers and took 30 minutes.
distance :: 5km
duration :: 30 minutes  

#healthy-habits
Running keeps me fit and energized.
benefit :: fitness
feeling :: energized

## Afternoon Work
I worked on my project.

^project-progress
Made significant progress on the data analysis.
task :: data analysis
progress :: significant
```

Try partitioning with:
1. Just headers-h1-h2
2. Just identifiers  
3. Just tags
4. Combined strategies

Notice how each creates different semantic granularity!