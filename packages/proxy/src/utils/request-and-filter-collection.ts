import { buildUrl } from './url.js';
import { enumeratedSchema } from './schemas.js';
import { wrapIntoPaginationInfo } from './pagination.js';
import { z, ZodTypeAny } from 'zod';

export async function requestAndFilterCollection<Parser extends ZodTypeAny>(
  baseUrl: string,
  query: Record<string, number | string>,
  schema: Parser,
  filter: (elem: z.infer<Parser>) => boolean,
  limit = 10,
) {
  const finalSchema = enumeratedSchema(schema);
  const filterQuery = {
    limit: 1000,
  };

  const res = await fetch(buildUrl(baseUrl, filterQuery))
    .then((res) => res.json())
    .then((json) => finalSchema.parse(json));

  const pageSize = Number(query.limit || 10);
  const pageNumber = Number(query.page || 0);

  const start = pageNumber * pageSize;
  const filtered = res.items.filter(filter).slice(start, start + pageSize);

  return wrapIntoPaginationInfo(filtered, baseUrl, limit);
}
