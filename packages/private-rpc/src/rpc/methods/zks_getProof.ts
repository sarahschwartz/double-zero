import { MethodHandler, RequestContext } from '@/rpc/rpc-service';
import { FastifyReplyType } from 'fastify/types/type-provider';
import { unauthorized } from '@/rpc/json-rpc';

export const zks_getProof: MethodHandler = {
  name: 'zks_getProof',
  async handle(
    _context: RequestContext,
    _method: string,
    _params: unknown[],
    id: number | string,
  ): Promise<FastifyReplyType> {
    return unauthorized(id);
  },
};
