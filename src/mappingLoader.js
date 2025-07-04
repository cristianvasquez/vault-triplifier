import { readFile } from 'fs/promises';
import { z } from 'zod';

const NamespaceSchema = z.record(z.string());

const MappingSchema = z.object({
  type: z.string(),
  key: z.string(),
  predicate: z.string(),
});

const DeclarativeMappingsSchema = z.object({
  namespaces: NamespaceSchema,
  mappings: z.array(MappingSchema),
});

async function loadMappings(filePath) {
  const fileContent = await readFile(filePath, 'utf-8');
  const json = JSON.parse(fileContent);
  return DeclarativeMappingsSchema.parse(json);
}

export { loadMappings };
