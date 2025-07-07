# Basic Properties

Learn the fundamental `property :: value` syntax for adding semantic meaning to your documents.

## The Core Syntax

The vault-triplifier uses a simple `property :: value` pattern to add semantic properties to any content block:

```markdown
# Alice

Alice is a fascinating character from Wonderland.

is a :: Person
age :: 25
hometown :: Wonderland
favorite color :: blue
```

## How It Works

- **Property names** can be simple words or phrases
- **Values** can be text, numbers, URLs, or links to other documents
- **Double colon** `::` separates the property from its value
- Properties are attached to the current content block (header, paragraph, or section)

## Value Types

### Text Values
```markdown
# Character Profile
name :: Alice Wonderland
description :: A curious girl who fell down a rabbit hole
status :: active character
```

### Numeric Values
```markdown
# Statistics
age :: 25
height :: 165
weight :: 55.5
year born :: 1998
```

### URL Values
```markdown
# Online Presence
website :: https://alice-wonderland.com
profile picture :: https://example.com/alice.jpg
social media :: https://twitter.com/alice_w
```

### Boolean-like Values
```markdown
# Character Traits
is curious :: true
has magical powers :: false
can fly :: no
is human :: yes
```

## Property Naming Conventions

Properties can use various naming styles:

```markdown
# Flexible Naming

# Simple words
name :: Alice
age :: 25

# Multi-word properties
full name :: Alice Wonderland
date of birth :: 1998-03-15
favorite activity :: reading books

# Abbreviations
dob :: 1998-03-15
fav :: reading
```

## Multiple Properties

Add as many properties as needed to fully describe your content:

```markdown
# Alice's Profile

Alice is the main character of our story.

is a :: Person
full name :: Alice Wonderland
age :: 25
occupation :: Student
hometown :: Oxford
current location :: Wonderland
personality :: curious
likes :: books
dislikes :: boring conversations
special ability :: fitting through small doors
status :: lost in wonderland
```

## Properties on Different Content Types

### Document Properties
```markdown
# My Document
This document describes Alice.

document type :: Character Profile
created by :: Lewis Carroll
last updated :: 2024-01-15
version :: 1.2
```

### Section Properties
```markdown
# Characters

## Alice
age :: 25
role :: protagonist

## Mad Hatter
age :: unknown
role :: supporting character
```

### Paragraph Properties
```markdown
Alice walked through the forest.

location :: Wonderland Forest
time :: afternoon
mood :: curious
weather :: sunny

She discovered a small door.

discovery :: magical door
size :: very small
material :: oak wood
```

## What Gets Generated

When you write:

```markdown
# Alice
is a :: Person
age :: 25
```

The vault-triplifier generates RDF triples like:

```turtle
<file:///Alice> a <http://example.org/Person> ;
    <http://example.org/age> "25" .
```

This creates machine-readable semantic data while keeping your markdown perfectly readable.

## Next Steps

Once you're comfortable with basic properties, learn about [Namespace Prefixes](02-namespace-prefixes.md) to use standard semantic vocabularies like schema.org.

## Practice Exercise

Try adding semantic properties to describe yourself:

```markdown
# Your Profile

[Write a brief description about yourself]

is a :: Person
name :: [Your name]
age :: [Your age]  
location :: [Your location]
occupation :: [Your job/role]
interests :: [What you enjoy]
```

Remember: The goal is to add semantic meaning while keeping the document natural and readable!