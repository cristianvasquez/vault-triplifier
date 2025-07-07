# Links and References

Connect documents and create relationship networks using wiki-links, section references, and external URLs.

## Types of Links

Vault-triplifier supports several ways to reference other content and create semantic relationships.

### Wiki-Style Document Links

Use double brackets to link to other documents in your vault:

```markdown
# Alice
knows :: [[Bob]]
lives near :: [[White Rabbit]]
studies with :: [[Professor]]
friend of :: [[Mad Hatter]]
```

### Section References

Link to specific sections within documents using the hash symbol:

```markdown
# Main Story
setting :: [[#Wonderland]]
climax :: [[Alice#Down the Rabbit Hole]]
resolution :: [[Story#The End]]

## Wonderland
This magical place is where everything happens.

location type :: schema:Place
description :: A world beyond logic
```

### External URLs

Link to external websites and resources:

```markdown
# Alice Profile
schema:url :: https://alice-wonderland.com
schema:image :: https://example.com/photos/alice.jpg
reference :: https://en.wikipedia.org/wiki/Alice%27s_Adventures_in_Wonderland
social media :: https://twitter.com/alice_w
```

### Markdown-Style Links

Standard markdown links work too and create semantic relationships:

```markdown
# Alice
studied at :: [Oxford University](https://ox.ac.uk)
inspired by :: [Lewis Carroll](https://en.wikipedia.org/wiki/Lewis_Carroll)
book :: [Alice's Adventures](https://gutenberg.org/alice)
```

## Link Patterns for Relationships

### Person-to-Person Relationships
```markdown
# Alice
foaf:knows :: [[Bob]]
schema:spouse :: [[Bob]]
schema:colleague :: [[Professor Smith]]
schema:friend :: [[Mad Hatter]]
schema:parent :: [[Alice's Mother]]
foaf:knows :: [[Cheshire Cat]]

# Bob
foaf:knows :: [[Alice]]
schema:spouse :: [[Alice]]
works with :: [[Professor Smith]]
```

### Person-to-Place Relationships
```markdown
# Alice
schema:homeLocation :: [[Oxford]]
schema:workLocation :: [[University]]
has visited :: [[Wonderland]]
wants to visit :: [[Paris]]
born in :: [[London]]

# Oxford
has resident :: [[Alice]]
type :: schema:City
located in :: [[England]]
```

### Person-to-Organization Relationships
```markdown
# Alice
schema:worksFor :: [[Oxford University]]
schema:memberOf :: [[Chess Club]]
schema:alumniOf :: [[Primary School]]

# Oxford University
schema:employee :: [[Alice]]
schema:location :: [[Oxford]]
founded :: 1096
```

### Document Relationships
```markdown
# Chapter 1: Down the Rabbit Hole
part of :: [[Alice's Adventures in Wonderland]]
next chapter :: [[Chapter 2: The Pool of Tears]]
main character :: [[Alice]]
introduces :: [[White Rabbit]]

# Chapter 2: The Pool of Tears  
part of :: [[Alice's Adventures in Wonderland]]
previous chapter :: [[Chapter 1: Down the Rabbit Hole]]
next chapter :: [[Chapter 3: A Caucus Race]]
```

## Bidirectional Relationships

Create relationships that work in both directions:

```markdown
# Alice
knows :: [[Bob]]
married to :: [[Bob]]

# Bob  
knows :: [[Alice]]
married to :: [[Alice]]
```

Or use different relationship types for each direction:

```markdown
# Alice
student of :: [[Professor]]

# Professor
teaches :: [[Alice]]
```

## Complex Reference Patterns

### Multiple Values for Same Property
```markdown
# Alice
knows :: [[Bob]]
knows :: [[Mad Hatter]]
knows :: [[White Rabbit]]
knows :: [[Cheshire Cat]]

# Or list format:
friends :: [[Bob]], [[Mad Hatter]], [[White Rabbit]]
```

### Qualified Relationships
```markdown
# Alice
knows :: [[Bob]] (since childhood)
works with :: [[Professor]] (research assistant)
lives near :: [[White Rabbit]] (next door)
```

### Temporal Relationships
```markdown
# Alice's Timeline
born in :: [[London]] (1998)
lived in :: [[Oxford]] (1998-2020)
moved to :: [[Wonderland]] (2020)
currently in :: [[Wonderland]]
```

## Cross-Vault References

Reference documents in other vaults or systems:

```markdown
# Alice
schema:sameAs :: vault://personal/people/Alice
external profile :: https://example.com/alice
wiki page :: https://wiki.example.com/Alice
```

## File and Media References

Link to files and media resources:

```markdown
# Alice's Portfolio
profile photo :: [[photos/alice-headshot.jpg]]
resume :: [[documents/alice-cv.pdf]]
portfolio :: [[presentations/alice-portfolio.pptx]]
voice recording :: [[audio/alice-intro.mp3]]
```

## URL Schemes and Protocols

Different URL types create different semantic meanings:

```markdown
# Alice's Digital Presence
website :: https://alice-wonderland.com
email :: mailto:alice@example.com
phone :: tel:+1-555-0123
location :: geo:51.7520,-1.2577
file :: file:///Users/alice/documents/cv.pdf
```

## Link Resolution

The vault-triplifier resolves different link types appropriately:

```markdown
# Internal Links (create RDF relationships)
friend :: [[Bob]]                    # → <alice> <friend> <bob>
location :: [[#Wonderland]]          # → <alice> <location> <alice#Wonderland>

# External Links (create literal or IRI values)
website :: https://example.com       # → <alice> <website> <https://example.com>
email :: alice@example.com          # → <alice> <email> "alice@example.com"
```

## Advanced Link Patterns

### Conditional Relationships
```markdown
# Alice
if in Wonderland :: knows [[Cheshire Cat]]
if at Oxford :: studies with [[Professor]]
if size is small :: can fit through [[Tiny Door]]
```

### Relationship Strength
```markdown
# Alice  
best friend :: [[Bob]]
close friend :: [[Mad Hatter]]
acquaintance :: [[White Rabbit]]
knows of :: [[Queen of Hearts]]
```

### Relationship Context
```markdown
# Alice
colleague :: [[Bob]] (at university)
neighbor :: [[White Rabbit]] (in Wonderland)
classmate :: [[Mad Hatter]] (in tea etiquette class)
```

## What Gets Generated

When you write:

```markdown
# Alice
knows :: [[Bob]]
lives in :: [[Oxford]]
website :: https://alice.example.com
```

The RDF output creates proper relationships:

```turtle
<file:///Alice> <http://example.org/knows> <file:///Bob> ;
    <http://example.org/lives_in> <file:///Oxford> ;
    <http://example.org/website> <https://alice.example.com> .
```

## Next Steps

Learn about [Inline Semantics](04-inline-semantics.md) to embed semantic properties naturally within your prose.

## Practice Exercise

Create a network of connected documents:

```markdown
# Person 1
[Description]
knows :: [[Person 2]]
works at :: [[Organization]]
lives in :: [[City]]

# Person 2  
[Description]
knows :: [[Person 1]]
lives in :: [[City]]

# Organization
[Description]  
located in :: [[City]]
employees :: [[Person 1]]

# City
[Description]
residents :: [[Person 1]], [[Person 2]]
organizations :: [[Organization]]
```

Build these connections to create a rich semantic network!