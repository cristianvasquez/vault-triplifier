# Vault-Triplifier Documentation

Transform your markdown documents into semantic RDF knowledge graphs with simple, natural syntax.

## What is Vault-Triplifier?

Vault-Triplifier converts markdown documents into RDF triples, allowing you to add semantic meaning to your notes using intuitive syntax. Write natural markdown with embedded semantic properties that get automatically converted into structured linked data.

## Quick Start

Add semantic properties to any markdown document using the `property :: value` syntax:

```markdown
# Alice
is a :: Person
age :: 25
knows :: [[Bob]]
schema:email :: alice@example.com
```

This generates RDF triples that can be queried, visualized, and integrated with other semantic data.

## Core Features

- **Natural Syntax**: Use `property :: value` to add semantics without breaking markdown readability
- **Namespace Support**: Built-in support for schema.org, FOAF, and custom vocabularies
- **Link Integration**: Connect documents with `[[wiki-links]]` and external URLs
- **Flexible Partitioning**: Control how documents are divided into semantic blocks
- **Position Selectors**: Track exact text locations for precise annotations

## Examples by Feature

### 📝 [Basic Properties](examples/01-basic-properties.md)
Learn the fundamental `property :: value` syntax for adding semantics to your documents.

### 🏷️ [Namespace Prefixes](examples/02-namespace-prefixes.md)
Use semantic vocabularies like schema.org and FOAF with namespace prefixes.

### 🔗 [Links and References](examples/03-links-and-references.md)
Connect documents and create relationships using wiki-links and external URLs.

### 💬 [Inline Semantics](examples/04-inline-semantics.md)
Embed semantic properties naturally within sentences using parenthetical syntax.

### 📋 [Document Partitioning](examples/05-document-partitioning.md)
Control how documents are divided into semantic sections using headers, tags, and anchors.

### 🔄 [Advanced Mappings](examples/06-advanced-mappings.md)
Create complex relationships and custom term mappings.

### 📄 [Frontmatter Integration](examples/07-frontmatter-integration.md)
Combine YAML frontmatter with semantic properties for document-level metadata.

## Reference Documentation

- **[Syntax Reference](syntax-reference.md)** - Complete guide to all syntax patterns
- **[Configuration](configuration.md)** - Partition strategies and customization options  
- **[RDF Output](rdf-output.md)** - Understanding the generated RDF structure

## Installation & Usage

```bash
npm install vault-triplifier
```

```javascript
import { triplifyFile } from 'vault-triplifier'

const pointer = await triplifyFile('./my-document.md', {
  partitionBy: ['headers-h1-h2', 'identifier'],
  includeLabelsFor: ['documents', 'sections']
})

console.log(pointer.dataset.toString())
```

## Why Semantic Markdown?

- **Human-Readable**: Your documents remain perfectly readable markdown
- **Machine-Processable**: Generate structured data for applications and AI
- **Interoperable**: Connect with existing semantic web technologies
- **Future-Proof**: Standards-based RDF output works with any RDF toolchain

## AI Agent Integration

This documentation is designed to teach AI agents how to write semantic markdown. The examples progress from simple to complex, showing patterns that agents can learn and apply to generate rich, semantically annotated documents.

---

*Ready to start? Begin with [Basic Properties](examples/01-basic-properties.md) to learn the core syntax.*

---

**Documentation Note**: This comprehensive documentation was created by Claude Code to provide examples and guidance for AI agent training on semantic document creation and the vault-triplifier library.