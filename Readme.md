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
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .
@prefix dot: <http://pkm-united.org/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix lpd: <http://www.w3.org/ns/ldp#> .
@prefix oa: <http://www.w3.org/ns/oa#> .

_:b2 rdfs:label "Wozenderlands" ;
        oa:hasSelector [
                rdf:type oa:TextPositionSelector ;
                oa:start 215 ;
                oa:end 231 ;
        ] ;
        a dot:Block, schema:Place ;
        schema:postalCode "4879" ;
        schema:streetAddress "5 Wonderland Street" .

<urn:property:loves%20to%20drink%20tea%20with> rdfs:label "loves to drink tea with" .

<urn:name:Alice> rdfs:label "Alice" ;
        a dot:NamedNote ;
        dot:contains [
                rdfs:label "Alice" ;
                oa:hasSelector [
                        rdf:type oa:TextPositionSelector ;
                        oa:start 0 ;
                        oa:end 7 ;
                ] ;
                rdf:type dot:Block ;
                schema:image <https://miro.medium.com/max/1100/1*xupcHn3b0jEFPkjvuH5Pbw.jpeg> ;
        ] ;
        prov:atLocation <file:///home/cvasquez/github.com/cristianvasquez/vault-triplifier/example-vault/Alice.md> .

<urn:resource:WhiteRabbit.md> rdfs:label "WhiteRabbit" ;
        a dot:NamedNote ;
        dot:contains [
                rdfs:label "White rabbit" ;
                oa:hasSelector [
                        rdf:type oa:TextPositionSelector ;
                        oa:start 0 ;
                        oa:end 14 ;
                ] ;
                rdf:type dot:Block, ex:Rabbit ;
                dot:contains _:b2 ;
                schema:address _:b2 ;
                <urn:property:loves%20to%20drink%20tea%20with> <urn:resource:Alice.md> ;
                schema:image <https://miro.medium.com/max/720/1*HZazTjGg9EBSOoz34IN-tA.jpeg> ;
        ] ;
        prov:atLocation <file:///home/cvasquez/github.com/cristianvasquez/vault-triplifier/example-vault/WhiteRabbit.md> .

ex:s ex:p ex:o .

```


## Usage

See the [generated_docs](./generated_docs.md) for details

## Diagram

Note that the concepts of Alice and the White rabbit are different entities than the Notes.

![](./example-vault/example.svg)

## Status

Expect the model to change as this is an experimental library
