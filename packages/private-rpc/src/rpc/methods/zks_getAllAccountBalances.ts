import { MethodHandler } from '@/rpc/rpc-service';
import { onlyCurrentUser } from '@/rpc/methods/utils';

export const zks_getAllAccountBalances: MethodHandler = onlyCurrentUser(
  'zks_getAllAccountBalances',
);
