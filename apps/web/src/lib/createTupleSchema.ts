import { z, ZodTypeAny } from 'zod';

export function createTupleSchema(schemas: [ZodTypeAny, ...ZodTypeAny[]]) {
  return z.tuple(schemas);
}
