# Vault Triplifier

Transform markdown documents into semantic RDF knowledge graphs with natural syntax.

## Quick Start

```bash
npm install vault-triplifier
```

```javascript
import { triplify } from "vault-triplifier";

const content = `# Team Directory

## Alice Johnson
schema:jobTitle :: Product Manager
schema:email :: alice@company.com
uri :: <https://company.com/employees/alice>
manages :: [[#Bob Smith]], [[Charlie Brown]]
expertise :: user research, roadmap planning

## Bob Smith  
schema:jobTitle :: Senior Developer
schema:email :: bob@company.com
uri :: urn:employee:bob-smith
reports to :: [[#Alice Johnson]]
specializes in :: backend development, databases`;

const { term, dataset } = triplify("./team.md", content);
```

**Generates semantic RDF:**
```turtle
@prefix schema: <http://schema.org/> .
@prefix prop: <urn:property:> .
@prefix name: <urn:name:> .

<https://company.com/employees/alice> <http://schema.org/jobTitle> "Product Manager" ;
    <http://schema.org/email> "alice@company.com" ;
    <urn:property:manages> <urn:name:team-directory#Bob%20Smith> ;
    <urn:property:manages> <urn:name:Charlie%20Brown> ;
    <urn:property:expertise> "user research", "roadmap planning" .

<urn:employee:bob-smith> <http://schema.org/jobTitle> "Senior Developer" ;
    <http://schema.org/email> "bob@company.com" ;
    <urn:property:reports%20to> <https://company.com/employees/alice> ;
    <urn:property:specializes%20in> "backend development", "databases" .
```

## Documentation

**Learn in order:**

1. **[Syntax](./docs/syntax-reference.md)** - Core triple formation rules
2. **[Memory Patterns](./docs/memory-patterns.md)** - Real-world examples
3. **[Configuration](./docs/configuration.md)** - Customization options