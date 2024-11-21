import { MethodHandler, RequestContext } from '@/rpc/rpc-service';
import { FastifyReplyType } from 'fastify/types/type-provider';
import { z } from 'zod';
import { addressSchema } from '@/schemas/address';
import { unauthorized } from '@/rpc/json-rpc';
import { delegateCall } from '@/rpc/delegate-call';

const paramsSchema = z.array(addressSchema).length(1);

export const zks_getAllAccountBalances: MethodHandler = {
  name: 'zks_getAllAccountBalances',
  async handle(
    context: RequestContext,
    method: string,
    params: unknown[],
    id: number | string,
  ): Promise<FastifyReplyType> {
    const user = context.currentUser;
    const [target] = paramsSchema.parse(params);
    if (user !== target) {
      return unauthorized(id);
    }

    return delegateCall({ url: context.targetRpcUrl, id, method, params });
  },
};
