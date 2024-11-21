import { FastifyReply, FastifyRequest } from 'fastify';
import { ModuleName } from './schemas.js';
import { pipeGetRequest } from '../../services/block-explorer.js';
import { FastifyApp } from '../../app.js';

export type Req = FastifyRequest & { query: Record<string, string> };

export type Handler = (
  app: FastifyApp,
  req: Req,
  reply: FastifyReply,
) => Promise<never>;

export type Handlers = {
  [_outer in ModuleName]: {
    [inner: string]: Handler;
  };
};

export const defaultHandler: Handler = (app, req, reply) => {
  const targetUrl = `${app.conf.proxyTarget}${req.url}`;
  return pipeGetRequest(targetUrl, reply);
};
