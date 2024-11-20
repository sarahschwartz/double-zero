import { defaultHandler, Handler } from './handlers.js';
import { z } from 'zod';
import { addressSchema } from '../../utils/schemas.js';
import { isAddressEqual } from 'viem';
import { getUserOrThrow } from '../../services/user.js';
import { buildUrl } from '../../utils/url.js';
import { HttpError } from '../../utils/http-error.js';

const withAddressSchema = z.object({
  address: addressSchema,
});

const withManyAddressesSchema = z.object({
  address: z
    .string()
    .transform((s) => s.split(',').map((s) => s.trim()))
    .pipe(z.array(addressSchema)),
});

const publicTxSchema = z.union([
  z.object({
    status: z.literal('1'),
    message: z.string(),
    result: z.array(
      z
        .object({
          from: addressSchema,
          to: addressSchema,
        })
        .passthrough(),
    ),
  }),
  z.object({
    status: z.literal('0'),
    message: z.string(),
    result: z.any(),
  }),
]);

const numberSchema = z.coerce.number().optional();

function paginate<T>(
  list: T[],
  page: string | undefined,
  offset: string | undefined,
): T[] {
  const pageSize = numberSchema.default(10).parse(offset);
  const pageNumber = numberSchema.default(1).parse(page) - 1;
  const start = pageNumber * pageSize;
  return list.slice(start, start + pageSize);
}

/**
 * If transactions of current user are requested, every tx can be seen.
 * Otherwise, transactions only sent or received by current user are shown.
 *
 * No successful results are returned back with no changes.
 * Pagination is hacked for the first 1000 items.
 * @param app
 * @param req
 * @param reply
 */
const txlist: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const address = withAddressSchema.parse(req.query).address;

  const url = buildUrl(`${app.conf.proxyTarget}/api`, {
    ...req.query,
    page: 1,
    offset: 1000,
  });

  const response = await fetch(url);

  if (user === address) {
    return reply.send(response.body);
  }

  const data = await response.json().then(publicTxSchema.parse);

  if (data.status === '0') {
    return reply.send(data);
  }

  const result = data.result.filter(
    (tx) => isAddressEqual(tx.to, user) || isAddressEqual(tx.from, user),
  );
  const filtered = {
    ...data,
    result: paginate(result, req.query.page, req.query.offset),
  };

  return reply.send(filtered);
};

/**
 * For this action we do the simplest possible check. Tx has to be from or to current user.
 * @param app
 * @param req
 * @param reply
 */
const txlistinternal: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);

  const url = buildUrl(`${app.conf.proxyTarget}/api`, {
    ...req.query,
    page: 1,
    offset: 1000,
  });

  const data = await fetch(url)
    .then((res) => res.json())
    .then(publicTxSchema.parse);

  if (data.status === '0') {
    return reply.send(data);
  }

  const result = data.result.filter(
    (tx) => isAddressEqual(tx.to, user) || isAddressEqual(tx.from, user),
  );
  const filtered = {
    ...data,
    result: paginate(result, req.query.page, req.query.offset),
  };

  return reply.send(filtered);
};

const passIfAddressIsCurrentUser: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const address = withAddressSchema.parse(req.query).address;

  if (!isAddressEqual(user, address)) {
    throw new HttpError('Only own address can be checked', 403);
  }
  return defaultHandler(app, req, reply);
};

const balancemulti: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const addresses = withManyAddressesSchema.parse(req.query).address;

  if (!addresses.every((a) => isAddressEqual(a, user))) {
    throw new HttpError('Only own address can be checked', 403);
  }

  return defaultHandler(app, req, reply);
};
const balance = passIfAddressIsCurrentUser;
const tokenbalance = passIfAddressIsCurrentUser;
const tokentx = passIfAddressIsCurrentUser;
const tokennfttx = passIfAddressIsCurrentUser;
const getminedblocks = passIfAddressIsCurrentUser;

export const accountHandlers = {
  txlist,
  txlistinternal,
  balance,
  balancemulti,
  tokenbalance,
  tokentx,
  tokennfttx,
  getminedblocks,
};
