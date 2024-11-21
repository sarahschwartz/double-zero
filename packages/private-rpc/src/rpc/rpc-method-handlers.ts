import {
  eth_call,
  eth_sendRawTransaction,
  zks_sendRawTransactionWithDetailedOutput,
} from '@/rpc/methods';
import { zks_getAllAccountBalances } from '@/rpc/methods/zks_getAllAccountBalances';
import { whoAmI } from '@/rpc/methods/who-am-i';

export const allHandlers = [
  zks_getAllAccountBalances,
  eth_call,
  whoAmI,
  zks_sendRawTransactionWithDetailedOutput,
  eth_sendRawTransaction,
];
