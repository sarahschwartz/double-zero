import { MethodHandler } from '@/rpc/rpc-service';
import { forbiddenMethod } from '@/rpc/methods/utils';

export const zks_getProof: MethodHandler = forbiddenMethod('zks_getProof');
