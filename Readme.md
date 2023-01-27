# Vault triplifier

produces structured data (RDF) from markdown files.

## Example

say you have two markdown files:

WhiteRabbit.md

```markdown
# White rabbit

The white rabbit (is a :: ex:Rabbit), and (lives in :: [[#Wozenderlands]]).

He (loves to drink tea with :: [[Alice]])

schema:image :: https://miro.medium.com/max/720/1*HZazTjGg9EBSOoz34IN-tA.jpeg

## Wozenderlands

Wozendarlands (is a :: schema:Place) where all the magic happens.

if you want, you can pass by! some coordinates:

schema:postalCode :: 4879
schema:streetAddress :: 5 Wonderland Street
```

Alice.md

```markdown
# Alice

Alice, we know alice

(schema:image :: https://miro.medium.com/max/1100/1*xupcHn3b0jEFPkjvuH5Pbw.jpeg)
```

After running the triplifier, one gets the following RDF data:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .
@prefix dot: <http://pkm-united.org/> .

<http://example.org/note/Alice.md> schema:name "Alice" ;
                                   dot:contains [
                                                   schema:name "Alice" ;
                                                   dot:selector "Alice" ;
                                                   schema:image <https://miro.medium.com/max/1100/1*xupcHn3b0jEFPkjvuH5Pbw.jpeg> ;
                                               ] ;
                                   a dot:Note .

_:b4 schema:name "Wozenderlands" ;
     dot:selector "Wozenderlands" ;
     a schema:Place ;
     schema:postalCode "4879" ;
     schema:streetAddress "5 Wonderland Street" .

<http://example.org/property/loves%20to%20drink%20tea%20with> schema:name "loves to drink tea with" .

<http://example.org/note/WhiteRabbit.md> schema:name "WhiteRabbit" ;
                                         dot:contains [
                                                         schema:name "White rabbit" ;
                                                         dot:selector "White rabbit" ;
                                                         schema:image <https://miro.medium.com/max/720/1*HZazTjGg9EBSOoz34IN-tA.jpeg> ;
                                                         dot:contains _:b4 ;
                                                         rdf:type ex:Rabbit ;
                                                         schema:address _:b4 ;
                                                         <http://example.org/property/loves%20to%20drink%20tea%20with> <http://example.org/note/Alice.md> ;
                                                     ] ;
                                         a dot:Note .
```

Note that the concepts of Alice and the White rabbit are different entities than the Notes.
## Usage

See the [example](./example.js) for details

## Status

Expect the model to change as this is an experimental library
