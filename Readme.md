# Vault Triplifier

Transform your markdown documents into semantic RDF knowledge graphs with simple, natural syntax.

## Quick Example (written by an LLM)

Transform a single markdown file with embedded semantic properties:

**alice-adventure.md**

```markdown
# Alice's Adventure

Alice (schema:age :: 25) (schema:occupation :: student) was walking through Oxford
when she spotted a White Rabbit (species :: rabbit) (notable feature :: pocket watch)
running past.

"I'm late!" exclaimed the rabbit (emotion :: panic) (destination :: [[#Tea Party]]).

Alice (reaction :: curious) decided to follow the rabbit down a mysterious hole
(depth :: unknown) (leads to :: [[Wonderland]]).

## Characters

### Alice

schema:name :: Alice Wonderland
schema:birthDate :: 1998-03-15
schema:email :: alice@wonderland.com
foaf:knows :: [[White Rabbit]]
personality :: curious, brave
current status :: lost in Wonderland

### White Rabbit

schema:name :: White Rabbit
species :: rabbit
accessory :: pocket watch
personality :: anxious, punctual
famous quote :: "I'm late!"
employer :: [[Queen of Hearts]]

## Locations

### Tea Party

event type :: social gathering
host :: [[Mad Hatter]]
time :: always 3 PM
participants :: [[Alice]], [[Mad Hatter]], [[March Hare]]
atmosphere :: chaotic

### Wonderland

schema:type :: fictional place
physics :: non-Euclidean
inhabitants :: talking animals
ruler :: [[Queen of Hearts]]
access method :: rabbit hole
```

This generates semantic RDF triples that capture the relationships between characters, locations, and events:

![Alice](./example-vault/alice.svg)

```javascript
import { triplify } from 'vault-triplifier'

const content = `# Alice
is a :: Person
age :: 25`

const { term, dataset } = triplify('./alice.md', content)
console.log(dataset.toString())
```

**Key Features Demonstrated:**

- **Inline semantics**: Properties embedded naturally in narrative text
- **Namespace support**: Standard vocabularies like `schema.org` and `foaf`
- **Document partitioning**: Separate entities for Characters and Locations sections
- **Link relationships**: References between Alice, White Rabbit, and locations
- **Mixed syntax**: Both inline `(property :: value)` and block `property :: value` patterns

## Documentation

- **[API Reference](./generated_docs.md)** - Usage examples and options
- **[Examples](./docs/examples/)** - Progressive tutorials from basic to advanced
- **[Syntax Reference](./docs/syntax-reference.md)** - Complete syntax guide
- **[Configuration](./docs/configuration.md)** - Options and customization

## Installation

```bash
npm install vault-triplifier
```

## Quick Usage

```javascript
// Content-based processing
import { triplify } from 'vault-triplifier'
const { term, dataset } = triplify('./path.md', markdownContent)

// File-based processing
import { triplifyFile } from 'vault-triplifier/node'
const { term, dataset } = await triplifyFile('./file.md', options)
```
