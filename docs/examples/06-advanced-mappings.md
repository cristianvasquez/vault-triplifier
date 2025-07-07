# Advanced Mappings

Create complex relationships and custom term mappings for sophisticated semantic modeling.

## Subject-Predicate-Object Patterns

Beyond simple `property :: value`, create explicit triples using `Subject :: predicate :: Object`:

```markdown
# Relationship Declarations

Alice :: knows :: Bob
Alice :: schema:spouse :: Bob  
Bob :: foaf:knows :: Alice

White Rabbit :: leads :: Alice
Alice :: follows :: White Rabbit

Oxford :: schema:hasEmployee :: Alice
Alice :: schema:worksFor :: Oxford

# Class Relationships
Person :: rdfs:subClassOf :: schema:Thing
Student :: rdfs:subClassOf :: Person
Alice :: rdf:type :: Student
```

## Complex Relationship Networks

Build sophisticated relationship networks:

```markdown
# Family Relationships
Alice :: schema:parent :: Alice's Mother
Alice :: schema:parent :: Alice's Father  
Alice :: schema:sibling :: Alice's Sister

Alice's Mother :: schema:spouse :: Alice's Father
Alice's Sister :: schema:sibling :: Alice

# Professional Networks
Alice :: schema:colleague :: Bob
Alice :: schema:colleague :: Professor Smith
Bob :: schema:colleague :: Professor Smith

Professor Smith :: schema:teaches :: Alice
Professor Smith :: schema:teaches :: Bob

# Social Networks  
Alice :: foaf:knows :: Mad Hatter
Alice :: foaf:knows :: Cheshire Cat
Mad Hatter :: foaf:knows :: March Hare
Cheshire Cat :: foaf:knows :: Queen of Hearts
```

## Custom Term Mappings

Define custom mappings for domain-specific vocabularies:

```markdown
# Configuration (in options):
# {
#   mappings: {
#     namespaces: {
#       story: "http://narrative.example.org/",
#       char: "http://characters.example.org/"
#     },
#     mappings: [
#       { type: "inlineProperty", key: "is a", predicate: "rdf:type" },
#       { type: "inlineProperty", key: "same as", predicate: "owl:sameAs" },
#       { type: "inlineProperty", key: "related to", predicate: "rdfs:seeAlso" }
#     ]
#   }
# }

# Using Custom Mappings
Alice :: is a :: char:Protagonist
White Rabbit :: is a :: char:Guide  
Mad Hatter :: is a :: char:Mentor

Alice :: related to :: [[Wonderland Characters]]
Alice :: same as :: [[Classic Literature Characters#Alice]]

Wonderland :: story:setting :: fantasy
Tea Party :: story:event :: social gathering
```

## Property Chains and Inference

Create property chains that enable inference:

```markdown
# Direct Relationships
Alice :: lives in :: Oxford
Oxford :: located in :: England  
England :: part of :: Europe

# Chain: Alice lives in Oxford, Oxford is in England, therefore Alice is in England

# Organizational Hierarchy
Alice :: works for :: Philosophy Department
Philosophy Department :: part of :: Oxford University
Oxford University :: member of :: Russell Group

# Academic Relationships
Alice :: student of :: Professor Smith
Professor Smith :: member of :: Philosophy Department
Philosophy Department :: offers :: Philosophy Degree
```

## Temporal Relationships

Model relationships that change over time:

```markdown
# Time-based Properties
Alice :: born in :: London (1998)
Alice :: lived in :: London (1998-2016)
Alice :: moved to :: Oxford (2016)  
Alice :: currently lives in :: Oxford (2016-present)

# Event Sequences
Alice :: first met :: White Rabbit (2024-03-15)
Alice :: followed :: White Rabbit (2024-03-15)
Alice :: arrived at :: Wonderland (2024-03-15)
Alice :: met :: Mad Hatter (2024-03-16)

# Relationship Evolution
Alice :: acquaintance of :: Bob (2020-2021)
Alice :: friend of :: Bob (2021-2023)
Alice :: best friend of :: Bob (2023-present)
```

## Conditional and Contextual Relationships

Model relationships that depend on context:

```markdown
# Context-Dependent Properties
Alice :: role in Wonderland :: visitor
Alice :: role at Oxford :: student  
Alice :: role in family :: daughter

# Conditional Relationships
Alice :: if in Wonderland :: can change size
Alice :: if drinking growth potion :: becomes larger
Alice :: if eating shrinking cake :: becomes smaller

# Situational Properties
Alice :: personality when curious :: brave
Alice :: personality when scared :: cautious
Alice :: personality when angry :: determined
```

## Multi-Value and Structured Properties

Handle complex, multi-faceted properties:

```markdown
# Multiple Values
Alice :: speaks :: English
Alice :: speaks :: French  
Alice :: speaks :: Latin

# Or as list
Alice :: languages :: English, French, Latin

# Structured Values
Alice :: address :: {
  street :: 123 Wonderland Lane
  city :: Oxford
  country :: England
  postal code :: OX1 2AB
}

# Qualified Relationships
Alice :: knows :: Bob {
  since :: 2020
  relationship type :: friend
  context :: university
  strength :: close
}
```

## Ontology and Class Definitions

Define your own ontology:

```markdown
# Class Hierarchy
schema:Thing :: rdf:type :: owl:Class
schema:Person :: rdfs:subClassOf :: schema:Thing
Student :: rdfs:subClassOf :: schema:Person
Graduate Student :: rdfs:subClassOf :: Student

# Property Definitions  
age :: rdf:type :: owl:DatatypeProperty
age :: rdfs:domain :: schema:Person
age :: rdfs:range :: xsd:integer

knows :: rdf:type :: owl:ObjectProperty
knows :: rdfs:domain :: schema:Person  
knows :: rdfs:range :: schema:Person

# Instance Declarations
Alice :: rdf:type :: Graduate Student
Bob :: rdf:type :: Student
Professor Smith :: rdf:type :: schema:Person
```

## Equivalence and Identity

Declare equivalent entities and properties:

```markdown
# Entity Equivalence
Alice :: owl:sameAs :: [[Other Vault#Alice]]
Alice :: owl:sameAs :: https://example.com/people/alice
Alice :: owl:sameAs :: urn:person:alice-wonderland

# Property Equivalence  
knows :: owl:equivalentProperty :: foaf:knows
email :: owl:equivalentProperty :: schema:email
name :: owl:equivalentProperty :: foaf:name

# Class Equivalence
Person :: owl:equivalentClass :: foaf:Person
Student :: owl:equivalentClass :: schema:Student
```

## Negation and Constraints

Express negative facts and constraints:

```markdown
# Negative Properties
Alice :: not :: robot
Alice :: does not live in :: Wonderland (normally)
White Rabbit :: not :: typical rabbit

# Constraints
Alice :: must have :: age
Person :: must have :: name
Student :: must be enrolled in :: institution

# Disjoint Classes
Person :: owl:disjointWith :: Animal
Fiction :: owl:disjointWith :: Non-fiction
Past :: owl:disjointWith :: Future
```

## Advanced Relationship Patterns

### Bidirectional Relationships
```markdown
# Symmetric Properties
Alice :: friend of :: Bob
Bob :: friend of :: Alice

# Or declare symmetry
friend of :: rdf:type :: owl:SymmetricProperty

# Inverse Properties
teaches :: owl:inverseOf :: studied by
Professor Smith :: teaches :: Alice  
Alice :: studied by :: Professor Smith
```

### Transitive Relationships
```markdown
# Declare transitivity
ancestor of :: rdf:type :: owl:TransitiveProperty

# Use transitively
Alice's Mother :: ancestor of :: Alice
Alice's Grandmother :: ancestor of :: Alice's Mother
# Inference: Alice's Grandmother ancestor of Alice

# Location transitivity
part of :: rdf:type :: owl:TransitiveProperty
Oxford :: part of :: England
England :: part of :: Europe
# Inference: Oxford part of Europe
```

### Functional Properties
```markdown
# Declare functionality (single-valued)
birth date :: rdf:type :: owl:FunctionalProperty
social security number :: rdf:type :: owl:FunctionalProperty

# Use (only one value allowed)
Alice :: birth date :: 1998-03-15
Alice :: ssn :: 123-45-6789
```

## Integration with External Vocabularies

Reference and extend existing vocabularies:

```markdown
# Import and Extend
foaf:Person :: rdfs:subClassOf :: schema:Person
wonderland:Character :: rdfs:subClassOf :: foaf:Person

# Use External Properties
Alice :: foaf:name :: Alice Wonderland
Alice :: schema:birthDate :: 1998-03-15
Alice :: dc:creator :: Lewis Carroll
Alice :: wonderland:hasVisited :: [[Rabbit Hole]]

# Mix Vocabularies
Alice :: foaf:knows :: Bob
Alice :: schema:colleague :: Bob  
Alice :: wonderland:adventures with :: Bob
```

## Validation and Quality

Add validation rules and quality constraints:

```markdown
# Required Properties
Person :: sh:property :: [
  sh:path :: schema:name
  sh:minCount :: 1
  sh:datatype :: xsd:string
]

# Value Constraints
age :: sh:datatype :: xsd:integer
age :: sh:minInclusive :: 0
age :: sh:maxInclusive :: 150

email :: sh:pattern :: "^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$"
```

## What Gets Generated

Complex mappings create rich RDF:

```turtle
# From: Alice :: knows :: Bob
<alice> <http://example.org/knows> <bob> .

# From: Alice :: schema:colleague :: Bob  
<alice> <http://schema.org/colleague> <bob> .

# From: Person :: rdfs:subClassOf :: schema:Thing
<Person> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://schema.org/Thing> .
```

## Next Steps

Learn about [Frontmatter Integration](07-frontmatter-integration.md) to combine YAML metadata with semantic properties.

## Practice Exercise

Create a complex domain model:

```markdown
# Define your domain (choose: academic, business, creative, etc.)

# Classes
[DomainClass] :: rdfs:subClassOf :: schema:Thing
[SpecificClass] :: rdfs:subClassOf :: [DomainClass]

# Properties  
[domainProperty] :: rdfs:domain :: [DomainClass]
[domainProperty] :: rdfs:range :: [ValueType]

# Instances
[Instance1] :: rdf:type :: [SpecificClass]
[Instance1] :: [domainProperty] :: [Value]
[Instance1] :: knows :: [Instance2]

# Relationships
[Instance1] :: [customRelation] :: [Instance2]
[Instance2] :: [inverseRelation] :: [Instance1]
```

Build a rich, interconnected semantic model!