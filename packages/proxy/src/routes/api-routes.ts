import type { FastifyApp } from '../app.js';
import { z } from 'zod';
import { findHandler } from './public-api-routes/index.js';
import { modulesEnum } from './public-api-routes/schemas.js';
import { pipePostRequest } from '../services/block-explorer.js';

const routeOptions = {
  schema: {
    querystring: z
      .object({
        module: modulesEnum,
        action: z.string(),
      })
      .catchall(z.string()),
  },
};

export function apiRoutes(app: FastifyApp) {
  app.get('/', routeOptions, async (req, reply) => {
    return findHandler(req.query.module, req.query.action)(app, req, reply);
  });

  const postSchema = {
    schema: {
      body: z.object({}).passthrough(),
    },
  };

  // We allow anyone to call verify contract. Verify a contract can only be done if you actually know
  // the contract, the address and the source code.
  app.post('/', postSchema, async (req, reply) => {
    const targetUrl = `${app.conf.proxyTarget}${req.url}`;
    return pipePostRequest(targetUrl, req.body, reply);
  });
}
