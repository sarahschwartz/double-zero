import type { FastifyApp } from '../app.js';
import { z } from 'zod';
import { isAddressEqual } from 'viem';
import { pipeGetRequest } from '../services/block-explorer.js';
import { getUserOrThrow } from '../services/user.js';
import { ForbiddenError } from '../utils/http-error.js';
import { addressSchema, logsSchema, transferSchema } from '../utils/schemas.js';
import { requestAndFilterCollection } from '../utils/request-and-filter-collection.js';

export const addressParamsSchema = {
  params: z.object({
    address: addressSchema,
  }),
  querystring: z.object({
    page: z.optional(z.coerce.number()),
    limit: z.optional(z.coerce.number()),
  }),
};

const transfersSchema = {
  params: z.object({
    address: addressSchema,
  }),
  querystring: z.object({
    page: z.optional(z.coerce.number()),
    limit: z.optional(z.coerce.number()),
    type: z.optional(
      z.enum(['deposit', 'transfer', 'withdrawal', 'fee', 'mint', 'refund']),
    ),
    fromDate: z.optional(z.string()),
    toDate: z.optional(z.string()),
  }),
};

export const addressRoutes = (app: FastifyApp) => {
  const proxyTarget = app.conf.proxyTarget;
  app.get('/:address', { schema: addressParamsSchema }, async (req, reply) => {
    const user = getUserOrThrow(req);
    if (!isAddressEqual(req.params.address, user)) {
      throw new ForbiddenError('Forbidden');
    }
    return pipeGetRequest(`${proxyTarget}/address/${user}`, reply);
  });

  app.get(
    '/:address/logs',
    {
      schema: addressParamsSchema,
    },
    async (req, _reply) => {
      const user = getUserOrThrow(req);
      const limit = req.query.limit || 10;
      const baseUrl = `${proxyTarget}/address/${req.params.address}/logs`;

      return await requestAndFilterCollection(
        baseUrl,
        req.query,
        logsSchema,
        (log) => log.address === user || log.topics.includes(user),
        limit,
      );
    },
  );

  app.get(
    '/:address/transfers',
    {
      schema: transfersSchema,
    },
    async (req, _reply) => {
      const user = getUserOrThrow(req);
      const limit = req.query.limit || 10;
      const baseUrl = `${proxyTarget}/address/${req.params.address}/transfers`;

      return await requestAndFilterCollection(
        baseUrl,
        req.query,
        transferSchema,
        (transfer) => transfer.from === user || transfer.to === user,
        limit,
      );
    },
  );
};
