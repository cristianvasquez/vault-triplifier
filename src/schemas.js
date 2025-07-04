import { z } from 'zod'

 const ContextSchema = z.object({
  pointer: z.any(), // Grapoi pointer
  path: z.string(),
  text: z.string().optional(),
  rootNode: z.any().optional(), // AST root node
  knownLinks: z.array(z.any()).optional(), // Array of known links
})

const MappingEntrySchema = z.object({
  type: z.literal('inlineProperty'),
  key: z.string(),
  predicate: z.string()
})

const DEFAULT_MAPPINGS = {
  namespaces: {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "http://schema.org/"
  },
  mappings: [
    {
      type: "inlineProperty",
      key: "is a",
      predicate: "rdf:type"
    },
    {
      type: "inlineProperty", 
      key: "same as",
      predicate: "rdf:sameAs"
    }
  ]
}

const MappingsSchema = z.object({
  namespaces: z.record(z.string()).optional(),
  mappings: z.array(MappingEntrySchema).optional()
}).default(DEFAULT_MAPPINGS)

const TriplifierOptions = z.object({
  addLabels: z.boolean().default(false),
  mappings: MappingsSchema,
})

const MarkdownTriplifierOptions = TriplifierOptions.extend({
  includeSelectors: z.boolean().default(true),
  includeRaw: z.boolean().default(false),
  splitOnId: z.boolean().default(true),
  splitOnTag: z.boolean().default(false),
  splitOnHeader: z.boolean().default(false),
})

export { ContextSchema, TriplifierOptions, MarkdownTriplifierOptions, MappingsSchema }
