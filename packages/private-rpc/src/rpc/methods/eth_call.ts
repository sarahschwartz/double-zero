import { z } from 'zod';
import { addressSchema } from '@/schemas/address';
import { hexSchema } from '@/schemas/hex';
import { MethodHandler } from '@/rpc/rpc-service';
import { isAddressEqual } from 'viem';
import { unauthorized } from '@/rpc/json-rpc';
import { delegateCall } from '@/rpc/delegate-call';
import { extractSelector } from '@/rpc/methods/utils';

const callReqSchema = z
  .object({
    from: addressSchema.optional(),
    to: addressSchema,
    data: hexSchema.optional(),
    input: hexSchema.optional(),
  })
  .passthrough();

export const eth_call: MethodHandler = {
  name: 'eth_call',
  async handle(context, method, params, id) {
    const call = callReqSchema.parse(params[0]);

    if (
      call.from === undefined ||
      !isAddressEqual(call.from, context.currentUser)
    ) {
      return unauthorized(id);
    }

    const data = call.data || call.input;
    if (
      data &&
      !context.authorizer.checkContractRead(call.to, data, context.currentUser)
    ) {
      return unauthorized(id);
    }

    return delegateCall({ url: context.targetRpcUrl, id, method, params });
  },
};
