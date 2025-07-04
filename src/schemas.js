import { z } from 'zod'

export const ContextSchema = z.object({
  pointer: z.any(), // Grapoi pointer
  path: z.string(),
  text: z.string().optional(),
  rootNode: z.any().optional(), // AST root node
  knownLinks: z.array(z.any()).optional() // Array of known links
})

export const OptionsSchema = z.object({
  addLabels: z.boolean().default(false),
  includeSelectors: z.boolean().default(true),
  includeRaw: z.boolean().default(false),
  splitOnId: z.boolean().default(true),
  splitOnTag: z.boolean().default(false),
  splitOnHeader: z.boolean().default(false),
  namespaces: z.record(z.any()).optional(),
  customMappings: z.record(z.any()).optional()
})
