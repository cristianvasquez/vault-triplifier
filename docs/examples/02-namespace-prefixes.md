# Namespace Prefixes

Use standard semantic vocabularies like schema.org and FOAF with namespace prefixes for interoperable, standards-based semantic data.

## Why Use Namespaces?

Instead of creating custom properties, use established vocabularies that are widely understood:

```markdown
# Alice - Without Namespaces (custom properties)
name :: Alice Wonderland
email :: alice@example.com
birthday :: 1998-03-15

# Alice - With Namespaces (standard properties)
schema:name :: Alice Wonderland
schema:email :: alice@example.com
schema:birthDate :: 1998-03-15
```

The namespace version creates data that can be understood by any system that knows schema.org vocabulary.

## Built-in Namespaces

### schema.org (Most Common)
Schema.org provides properties for describing people, places, things, and events:

```markdown
# Person with Schema.org Properties
schema:name :: Alice Wonderland
schema:email :: alice@wonderland.com
schema:birthDate :: 1998-03-15
schema:jobTitle :: Student
schema:address :: Oxford, England
schema:telephone :: +44-123-456-7890
schema:url :: https://alice-wonderland.com
schema:description :: A curious student who loves adventures
```

### FOAF (Friend of a Friend)
FOAF is designed for describing people and their relationships:

```markdown
# Person with FOAF Properties
foaf:name :: Alice Wonderland
foaf:nick :: Alice
foaf:mbox :: alice@wonderland.com
foaf:homepage :: https://alice-wonderland.com
foaf:age :: 25
foaf:knows :: [[Bob]]
foaf:knows :: [[Mad Hatter]]
```

### Dublin Core (Metadata)
Dublin Core provides properties for describing documents and resources:

```markdown
# Document Metadata
dc:title :: Alice's Adventures in Wonderland
dc:creator :: Lewis Carroll
dc:date :: 1865-11-26
dc:description :: A children's novel about a girl named Alice
dc:language :: en
dc:type :: Novel
```

## Common Schema.org Properties

### For People (schema:Person)
```markdown
# Alice - Complete Person Profile
schema:name :: Alice Wonderland
schema:givenName :: Alice
schema:familyName :: Wonderland
schema:email :: alice@example.com
schema:telephone :: +1-555-0123
schema:birthDate :: 1998-03-15
schema:gender :: Female
schema:nationality :: British
schema:jobTitle :: Student
schema:worksFor :: Oxford University
schema:address :: Oxford, England
schema:url :: https://alice-wonderland.com
schema:image :: https://example.com/alice-photo.jpg
```

### For Places (schema:Place)
```markdown
# Wonderland
is a :: schema:Place
schema:name :: Wonderland
schema:description :: A magical place full of curious creatures
schema:addressCountry :: Fictional
schema:geo :: 51.7520° N, 1.2577° W
```

### For Organizations (schema:Organization)
```markdown
# Oxford University
is a :: schema:Organization
schema:name :: Oxford University
schema:url :: https://www.ox.ac.uk
schema:foundingDate :: 1096
schema:address :: Oxford, England
schema:email :: info@ox.ac.uk
```

### For Events (schema:Event)
```markdown
# Tea Party
is a :: schema:Event
schema:name :: Mad Hatter's Tea Party
schema:startDate :: 2024-03-15T15:00:00
schema:endDate :: 2024-03-15T17:00:00
schema:location :: [[Wonderland]]
schema:organizer :: [[Mad Hatter]]
schema:attendee :: [[Alice]]
schema:description :: An unbirthday celebration
```

## Custom Namespaces

You can define your own namespaces for domain-specific vocabularies:

```markdown
# Configure custom namespaces in options:
# {
#   namespaces: {
#     "wonderland": "http://wonderland.example.org/vocab#",
#     "story": "http://narrative.example.org/terms#"
#   }
# }

# Using Custom Namespaces
wonderland:magicalAbility :: shrinking
wonderland:favoritePotion :: drink me
story:characterRole :: protagonist
story:storyArc :: hero's journey
```

## Combining Namespaces

Mix and match different vocabularies as needed:

```markdown
# Alice - Mixed Vocabularies
# Basic identification
schema:name :: Alice Wonderland
foaf:nick :: Alice

# Contact information  
schema:email :: alice@wonderland.com
foaf:homepage :: https://alice-wonderland.com

# Relationships
foaf:knows :: [[White Rabbit]]
schema:knows :: [[Mad Hatter]]

# Custom domain properties
wonderland:hasVisited :: [[Rabbit Hole]]
wonderland:size :: variable
```

## Common Property Patterns

### Relationships Between People
```markdown
# Alice
foaf:knows :: [[Bob]]
schema:spouse :: [[Bob]]
schema:parent :: [[Alice's Mother]]
schema:sibling :: [[Alice's Sister]]
schema:colleague :: [[Professor]]
schema:friend :: [[Mad Hatter]]
```

### Temporal Properties
```markdown
# Event Timeline
schema:startDate :: 2024-03-15
schema:endDate :: 2024-03-16
schema:dateCreated :: 2024-01-01
schema:dateModified :: 2024-03-15
schema:validFrom :: 2024-01-01
schema:validThrough :: 2024-12-31
```

### Structured Values
```markdown
# Contact Information
schema:address :: {
  schema:streetAddress :: 123 Wonderland Lane
  schema:addressLocality :: Oxford
  schema:addressCountry :: England
  schema:postalCode :: OX1 2AB
}

# Or simplified:
schema:streetAddress :: 123 Wonderland Lane
schema:addressLocality :: Oxford
schema:postalCode :: OX1 2AB
```

## Best Practices

### 1. Use Standard Properties When Available
```markdown
# Good - uses standard schema.org
schema:name :: Alice
schema:email :: alice@example.com

# Avoid - custom properties for common concepts
custom_name :: Alice
contact_email :: alice@example.com
```

### 2. Be Consistent
```markdown
# Pick one namespace for similar properties
schema:name :: Alice
schema:email :: alice@example.com  
schema:birthDate :: 1998-03-15

# Avoid mixing unnecessarily
schema:name :: Alice
foaf:mbox :: alice@example.com
dc:date :: 1998-03-15
```

### 3. Use Appropriate Types
```markdown
# People
schema:Person
foaf:Person

# Places  
schema:Place
schema:City
schema:Country

# Organizations
schema:Organization
schema:Corporation
schema:EducationalOrganization
```

## What Gets Generated

When you write:

```markdown
# Alice
schema:name :: Alice Wonderland
schema:email :: alice@example.com
foaf:knows :: [[Bob]]
```

The RDF output uses proper namespace URIs:

```turtle
<file:///Alice> <http://schema.org/name> "Alice Wonderland" ;
    <http://schema.org/email> "alice@example.com" ;
    <http://xmlns.com/foaf/0.1/knows> <file:///Bob> .
```

## Next Steps

Learn how to create [Links and References](03-links-and-references.md) to connect your documents and create relationship networks.

## Practice Exercise

Describe a place using schema.org properties:

```markdown
# [Your Favorite Place]

[Brief description]

is a :: schema:Place
schema:name :: [Place name]
schema:description :: [What makes it special]
schema:addressLocality :: [City]
schema:addressCountry :: [Country]
schema:url :: [Website if any]
```