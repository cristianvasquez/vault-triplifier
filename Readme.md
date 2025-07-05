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

(ex:s :: ex:p :: ex:o)
```

After running the triplifier, one gets the following RDF data:

```turtle
@prefix dot: <http://pkm-united.org/> .
@prefix lpd: <http://www.w3.org/ns/ldp#> .
@prefix oa: <http://www.w3.org/ns/oa#> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<file:///vault-triplifier/example-vault/WhiteRabbit.md> a dot:MarkdownDocument ;
    dot:represents <urn:resource:WhiteRabbit.md> ;
    prov:atLocation <file:///vault-triplifier/example-vault/WhiteRabbit.md> ;
    prov:generatedAtTime "2025-07-05T10:49:46.761Z"^^xsd:dateTime .

<file:///vault-triplifier/example-vault/Alice.md> a dot:MarkdownDocument ;
    dot:represents <urn:resource:Alice.md> ;
    prov:atLocation <file:///vault-triplifier/example-vault/Alice.md> ;
    prov:generatedAtTime "2025-07-05T10:49:46.778Z"^^xsd:dateTime .

<urn:resource:WhiteRabbit.md> a dot:NamedNote ;
    rdfs:label "WhiteRabbit" ;
    dot:contains [
        a dot:Block ;
        rdfs:label "White rabbit" ;
        dot:contains [
            a dot:Block ;
            rdfs:label "Wozenderlands" ;
            oa:hasSelector [
                a oa:TextPositionSelector ;
                oa:start 215 ;
                oa:end 231 ;
            ] ;
            <urn:property:is%20a> schema:Place ;
            schema:postalCode "4879" ;
            schema:streetAddress "5 Wonderland Street"
        ] ;
        oa:hasSelector [
            a oa:TextPositionSelector ;
            oa:start 0 ;
            oa:end 14 ;
        ] ;
        <urn:property:is%20a> <http://example.org/Rabbit> ;
        schema:address [
            a dot:Block ;
            rdfs:label "Wozenderlands" ;
            oa:hasSelector [
                a oa:TextPositionSelector ;
                oa:start 215 ;
                oa:end 231 ;
            ] ;
            <urn:property:is%20a> schema:Place ;
            schema:postalCode "4879" ;
            schema:streetAddress "5 Wonderland Street"
        ] ;
        <urn:property:loves%20to%20drink%20tea%20with> <urn:resource:Alice.md> ;
        schema:image <https://miro.medium.com/max/720/1*HZazTjGg9EBSOoz34IN-tA.jpeg>
    ] ;
    dot:hasRepresentation <file:///vault-triplifier/example-vault/WhiteRabbit.md> .

<urn:resource:Alice.md> a dot:NamedNote ;
    rdfs:label "Alice" ;
    dot:contains [
        a dot:Block ;
        rdfs:label "Alice" ;
        oa:hasSelector [
            a oa:TextPositionSelector ;
            oa:start 0 ;
            oa:end 7 ;
        ] ;
        schema:image <https://miro.medium.com/max/1100/1*xupcHn3b0jEFPkjvuH5Pbw.jpeg> ;
        <urn:property:dot> "asd"
    ] ;
    dot:hasRepresentation <file:///vault-triplifier/example-vault/Alice.md> .

<urn:property:is%20a> rdfs:label "is a" .

<urn:property:loves%20to%20drink%20tea%20with> rdfs:label "loves to drink tea with" .

<urn:property:dot> rdfs:label "dot" .

```


## Usage

See the [generated_docs](./generated_docs.md) for details

## Diagram

Note that the concepts of Alice and the White rabbit are different entities than the Notes.

![](./example-vault/example.svg)

## Status

Expect the model to change as this is an experimental library
