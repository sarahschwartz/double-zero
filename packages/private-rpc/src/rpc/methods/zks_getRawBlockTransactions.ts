import { MethodHandler, RequestContext } from '@/rpc/rpc-service';
import { FastifyReplyType } from 'fastify/types/type-provider';
import { delegateCall } from '@/rpc/delegate-call';
import { request } from '@/rpc/json-rpc';
import { z } from 'zod';
import { addressSchema } from '@/schemas/address';
import { isAddressEqual } from 'viem';

const schema = z
  .object({
    jsonrpc: z.literal('2.0'),
    id: z.any(),
    result: z.array(
      z
        .object({
          common_data: z
            .object({
              L2: z.object({ initiatorAddress: addressSchema }).passthrough(),
            })
            .passthrough(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export const zks_getRawBlockTransactions: MethodHandler = {
  name: 'zks_getRawBlockTransactions',
  async handle(
    context: RequestContext,
    method: string,
    params: unknown[],
    id: number | string,
  ): Promise<FastifyReplyType> {
    const data = await fetch(context.targetRpcUrl, {
      method: 'POST',
      body: JSON.stringify(request({ id, method, params })),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => schema.parse(json));

    const filtered = data.result.filter((r) =>
      isAddressEqual(r.common_data.L2.initiatorAddress, context.currentUser),
    );

    return {
      ...data,
      result: filtered,
    };
  },
};
