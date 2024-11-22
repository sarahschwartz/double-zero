import { onlyCurrentUser } from '@/rpc/methods/utils';

export const eth_getBalance = onlyCurrentUser('eth_getBalance');
