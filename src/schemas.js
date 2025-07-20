import { z } from 'zod'

const ContextSchema = z.object({
  pointer: z.any(), // Grapoi pointer
  path: z.string(),
  text: z.string().optional(),
  rootNode: z.any().optional(), // AST root node
  knownLinks: z.array(z.any()).optional(), // Array of known links
})

const DEFAULT_MAPPINGS = {
  prefix: {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    schema: 'http://schema.org/',
  },
  mappings: {
    'same as': 'rdfs:sameAs',
    'is a': 'rdf:type',
  },
}

const TriplifierOptions = z.object({
  uri: z.string().optional(),
  includeLabelsFor: z.array(
    z.enum(['documents', 'sections', 'anchors', 'properties']),
  ).default([]),
  prefix: z.record(z.string()).optional().default(DEFAULT_MAPPINGS.prefix),
  mappings: z.record(z.string()).optional().default(DEFAULT_MAPPINGS.mappings),
})

const MarkdownTriplifierOptions = TriplifierOptions.extend({
  includeSelectors: z.boolean().default(true),
  includeRaw: z.boolean().default(false),
  partitionBy: z.array(z.enum(
    ['identifier', 'tag', 'headers-all', 'headers-h1-h2', 'headers-h2-h3', 'headers-h1-h2-h3'])).
    default(['identifier']),
  includeCodeBlockContent: z.boolean().default(true),
  parseCodeBlockTurtleIn: z.array(z.string()).default(['turtle;triplify']),
}).strict()

export {
  ContextSchema,
  TriplifierOptions,
  MarkdownTriplifierOptions,
}
