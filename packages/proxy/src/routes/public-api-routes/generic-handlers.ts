import { numberSchema, withAddressSchema } from './schemas.js';
import { defaultHandler, Handler } from './handlers.js';
import { getUserOrThrow } from '../../services/user.js';
import { isAddressEqual } from 'viem';
import { HttpError } from '../../utils/http-error.js';

export function paginate<T>(
  list: T[],
  page: string | undefined,
  offset: string | undefined,
): T[] {
  const pageSize = numberSchema.default(10).parse(offset);
  const pageNumber = numberSchema.default(1).parse(page) - 1;
  const start = pageNumber * pageSize;
  return list.slice(start, start + pageSize);
}

export const passIfAddressIsCurrentUser: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const address = withAddressSchema.parse(req.query).address;

  if (!isAddressEqual(user, address)) {
    throw new HttpError('Only own address can be checked', 403);
  }
  return defaultHandler(app, req, reply);
};
