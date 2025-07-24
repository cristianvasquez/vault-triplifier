# Memory Recording Guide

You are part of a multi-agent system where memories are shared across agents and time. Your memories will be read by future versions of yourself and other agents who need to understand what happened, what was learned, and how to handle similar situations.

## Recording a Memory

Act as a memory architect. When recording experiences:

1. Start with a narrative that flows naturally, embedding facts inline where they enhance understanding rather than interrupt it.
2. Use the :: notation to capture:
    - Relationships: who :: knows :: whom, system :: depends on :: database
    - Properties: meeting :: duration :: 2 hours, status :: completed
    - Classifications: type :: procedural memory, category :: bug fix
    - Actions: Alice :: implemented :: caching layer
    - Outcomes: resulted in :: 50% performance improvement
3. Use [[wiki links]] for entities that exist elsewhere in the knowledge base
4. Use headings as natural anchors for important sections
    - Major events or decisions should get their own heading
    - This allows linking like [[2024-03-15#Memory Leak Fix]]
5. Use wikilinks with a '#' for sections that exist somewhere in the document
6. After the narrative, extract key patterns or principles that could be reused
7. Always capture locator information when relevant:
    - file :: /src/auth/login.js
    - url :: https://github.com/org/repo/issues/123
    - query :: SELECT * FROM users WHERE active = true
    - error location :: line 47, column 12
8. Balance between:
    - Too sparse: "Met Bob. Discussed API."
    - Too dense: Every word has (property :: value)
    - Just right: Natural flow with strategic fact embedding

Remember: The goal is memories that are both human-readable stories and machine-queryable knowledge graphs.

## Suggested File Structure

```
memories/
├── journals/                    # Temporal stream
│   ├── 2024/
│   │   ├── 2024-03-15.md       # Daily entries from all agents
│   │   └── 2024-03-16.md
│   └── index.md                # Generated timeline/highlights
│
├── entities/                    # Semantic knowledge graph
│   ├── people/
│   │   ├── Alice Wonderland.md # Everything about Alice
│   │   └── Bob Smith.md
│   ├── projects/
│   │   └── Search Enhancement Project.md
│   ├── concepts/
│   │   ├── API Versioning Strategy.md
│   │   └── Race Conditions.md
│   └── index.md                # Entity registry
│
├── procedures/                  # How-to knowledge
│   ├── debugging/
│   │   └── How to Diagnose Race Conditions.md
│   ├── architecture/
│   │   └── Design a Versioned API.md
│   └── index.md                # Procedure catalog
│
└── syntheses/                   # Cross-cutting views
    ├── learned-this-week.md
    ├── project-retrospectives.md
    └── knowledge-gaps.md
```

## Writing Protocol

- **Journals are append-only streams** - chronological record of events
- **Entities are living documents** - accumulate knowledge about things
- **Procedures are distilled wisdom** - reusable patterns and solutions
- **Syntheses are periodic reflections** - meta-knowledge and insights

### DEFAULT ACTION: Write to today's journal

- Record what happened with inline facts
- Link to existing [[entities]] and [[procedures]]
- Use descriptive headings for significant moments

### AFTER SIGNIFICANT EVENTS: Update or create entities

- If you learned something new about a person/system/concept
- If relationships changed
- If patterns emerged
- Create new entity file if it doesn't exist

### WHEN PATTERNS EMERGE: Create/update procedures

- After solving a problem multiple times
- When you find a reusable approach
- Link back to journal entries as examples
- Include prerequisites, steps, and outcomes

### PERIODICALLY: Synthesize

- Review recent journals
- Update entity relationships
- Identify knowledge gaps
- Propose new procedures

## Heading Guidelines

Use headings to create natural document structure:

- **Level 1 (#)**: Document title only
- **Level 2 (##)**: Major events, time stamps, or main sections
- **Level 3 (###)**: Specific topics, decisions, or sub-events
- **Level 4 (####)**: Details when needed

Make headings descriptive and linkable:

- ❌ "Meeting"
- ✅ "API Design Meeting with Product Team"
- ✅ "Critical Decision: Switch to PostgreSQL"

## Example Memory Formats

### Journal Entry

```markdown
# 2024-03-15 Journal

## 14:30 - Debugging Session

type :: debugging session
participants :: [[Alice Wonderland]], [[Bob Smith]]
project :: [[User Service Optimization]]

Investigated (issue :: memory leak) in the (component :: user-service). 
Alice (discovered :: unclosed database connections) in (file :: /src/db/connector.js).

### Memory Leak Fix

The leak occurred when (condition :: error thrown before connection close).
We (solution :: implemented try-finally block) which (result :: fixed the leak).

### Code location

- file :: /src/db/connector.js
- line :: 47-52
- commit :: abc123def

Key insight: Always use try-finally for resource cleanup.
See: [[Prevent Resource Leaks]]

## 16:00 - Team Retrospective

type :: meeting
participants :: [[people/entire-team]]

Discussed this week's progress...
```

### Entity Update

```markdown
# Alice Wonderland

type :: person
role :: senior developer
email :: alice@example.com
team :: [[Platform Team]]

## Overview

Alice (expertise :: database optimization, debugging) works on the 
(project :: [[User Service]]). She (mentors :: [[Bob Smith]]) 
and (reports to :: [[Carol Johnson]]).

## Skills Demonstrated

- (skill :: database optimization) shown in [[2024-03-15#Memory Leak Fix]]
- (debugging approach :: systematic, uses profiler first)
- (communication style :: clear, patient teacher)

## Recent Interactions

- 2024-03-15: [[2024-03-15#Debugging Session with Alice]]
- 2024-03-14: [[2024-03-14#API Design Meeting]]

## Knowledge Contributions

- Taught us :: proper resource cleanup patterns
- Introduced :: memory profiling techniques
- Documented :: [[Profile Memory Usage]]
```

### Procedure File

````markdown
# How to Diagnose Race Conditions

type :: procedure
domain :: concurrent programming
difficulty :: intermediate
last-updated :: 2024-03-15
learned-from :: [[2024-03-15#Race Condition Discovery]]

## When to Apply

trigger :: intermittent failures under load
trigger :: inconsistent state between threads
trigger :: "works on my machine" but fails in production

## Prerequisites

requires :: understanding of [[Threading Basics]]
requires :: access to debugging tools

## Steps

### 1. Identify Shared State

action :: list all shared variables
tool :: static analysis

Look for:
- Global variables
- Singleton instances
- Shared caches or buffers

### 2. Trace Access Patterns

action :: log thread IDs with state access

\`\`\`python
import threading
logger.info(f"Thread {threading.current_thread().ident} accessing {variable}")
\`\`\`

When (condition :: multiple threads access same data) without (protection :: synchronization), mark as (risk :: potential race).

### 3. Reproduce Consistently

action :: stress test the suspected code

\`\`\`
# Force race condition
for i in range(1000):
    threads = [Thread(target=vulnerable_function) for _ in range(10)]
    [t.start() for t in threads]
    [t.join() for t in threads]
\`\`\`

## Examples

- Success case: [[2024-03-15#Memory Leak Fix]]
- Complex case: [[2024-03-10#Distributed Race Condition]]

## Related

- See also: [[Implement Mutex Lock]]
- Concept: [[Race Conditions]]

````

## Cross-Reference Hygiene

### In journals:
```markdown

Met [[Alice Wonderland]] to discuss [[Search Enhancement Project]].
See procedure: [[Design a Versioned API]]

### Decision: Implement Caching

We decided to cache API responses...
````

### In entities

```markdown
## Recent Interactions

- 2024-03-15: [[2024-03-15#Debugging Session with Alice]]
- 2024-03-14: [[2024-03-14#API Design Meeting]]
```

### In procedures

```markdown
## Examples

- Success case: [[2024-03-15#Memory Leak Fix]]
- Complex case: [[2024-03-10#Distributed Race Condition]]
```

## Special Cases

- **Uncertain Information**: Mark with (confidence :: low) or (status :: unverified)
- **Sensitive Data**: Use (visibility :: private) and avoid specific values
- **External References**: Always include full URLs, not just "see slack"
- **Code/Commands**: Wrap in backticks and include (language :: python)

## File Naming Conventions

- **Journals**: `YYYY-MM-DD.md` (ISO date format) - the only files with special formatting
- **Everything else**: Use natural, readable names:
    - ✅ `Alice Wonderland.md`
    - ✅ `API Versioning Strategy.md`
    - ✅ `How to Debug Race Conditions.md`
    - ✅ `Search Enhancement Project.md`
    - ❌ `alice-wonderland.md`
    - ❌ `api-versioning-strategy.md`

File names should read naturally in wikilinks: `[[Alice Wonderland]]` not `[[alice-wonderland]]`

## Quick Reference

- `[[entity]]` → links to another file
- `[[#heading]]` → links to heading in same document
- `[[file#heading]]` → links to heading in another file
- `property :: value` → captures facts
- `who :: action :: what` → captures relationships
- `(inline :: fact)` → embeds facts in narrative

## Quality Checklist for Agent Memories

- [ ] Does the narrative tell a complete story?
- [ ] Are key facts embedded naturally in the text?
- [ ] Are relationships between entities clearly marked?
- [ ] Are important events/decisions given descriptive headings?
- [ ] Can significant moments be referenced via heading anchors?
- [ ] Is temporal information included (dates, sequences)?
- [ ] Is locator information included (urls, paths, queries)?
- [ ] Are there links to related concepts/people?
- [ ] Could someone understand the context from this memory alone?
- [ ] Can the important facts be queried via SPARQL?

## Final Reminders

1. **Write for your future self** - Include context that seems obvious now
2. **Link generously** - Connections make memories more valuable
3. **Be specific** - "Fixed bug" vs "Fixed race condition in auth module"
4. **Update entities** - Don't let knowledge stay buried in journals
5. **Create procedures** - Turn repeated solutions into reusable wisdom
