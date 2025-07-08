---
title: Partition Test Document
author: Test Suite
type: comprehensive
tags: [test, partition, comprehensive]
---

# Main Document Title

This document tests all partitioning scenarios for the vault-triplifier.

Content before first partition element.

is a :: TestDocument
created :: 2024-01-01

## Section with Header

This content belongs to the section header block when partitionBy includes 'header'.

has property :: section value
related to :: [[#Another Section]]

^section1

This content has an identifier anchor. When partitionBy includes 'identifier', this becomes a separate block.

identifier property :: identifier value

#important #test

This content has tags. When partitionBy includes 'tag', this becomes a separate block.

tag property :: tag value
connects to :: https://example.com

### Nested Header

Nested headers should also trigger partitioning when 'header' is enabled.

nested property :: nested value

^nested-ref

Combined identifier and nested header.

combined :: identifier and header

#urgent

Combined tag with nested structure.

urgent property :: urgent value

## Another Section

Cross-references and links test:

refers to :: [[#section1]]
external link :: [Example](https://example.com)
wiki link :: [[NonExistent]]

^final-anchor

Final test with identifier at end.

final property :: final value

#conclusion

Document conclusion with tag.

summary :: This document tests all partition scenarios