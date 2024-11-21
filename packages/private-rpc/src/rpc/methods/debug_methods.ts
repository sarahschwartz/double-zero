import { forbiddenMethod } from '@/rpc/methods/utils';

export const debug_traceBlockByHash = forbiddenMethod('debug_traceBlockByHash');
export const debug_traceBlockByNumber = forbiddenMethod(
  'debug_traceBlockByNumber',
);
export const debug_traceCall = forbiddenMethod('debug_traceCall');
export const debug_traceTransaction = forbiddenMethod('debug_traceTransaction');
