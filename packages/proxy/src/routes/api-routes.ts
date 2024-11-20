import type { FastifyApp } from '../app.js';
import { z } from 'zod';
import { findHandler } from './public-api-routes/index.js';
import { modulesEnum } from './public-api-routes/schemas.js';

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
    return findHandler(req.query.module, req.query.action)(
      app,
      req,
      reply,
    );
  });
}
