import { Hex } from 'viem';
import { MethodHandler, RequestContext } from '@/rpc/rpc-service';
import { FastifyReplyType } from 'fastify/types/type-provider';
import { unauthorized } from '@/rpc/json-rpc';

export function extractSelector(calldata: Hex): Hex {
  return calldata.substring(0, 10) as Hex;
}

export function forbiddenMethod(name: string): MethodHandler {
  return {
    name,
    async handle(
      _context: RequestContext,
      _method: string,
      _params: unknown[],
      id: number | string,
    ): Promise<FastifyReplyType> {
      return unauthorized(id);
    },
  };
}

export function areHexEqual(a: Hex, b: Hex): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
