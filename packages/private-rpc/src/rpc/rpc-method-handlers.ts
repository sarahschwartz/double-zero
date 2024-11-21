import {
  eth_call,
  eth_sendRawTransaction,
  zks_sendRawTransactionWithDetailedOutput,
} from '@/rpc/methods';
import { zks_getAllAccountBalances } from '@/rpc/methods/zks_getAllAccountBalances';
import { whoAmI } from '@/rpc/methods/who-am-i';
import { zks_getRawBlockTransactions } from '@/rpc/methods/zks_getRawBlockTransactions';
import { zks_getProof } from '@/rpc/methods/zks_getProof';
import {
  debug_traceBlockByHash,
  debug_traceBlockByNumber,
  debug_traceCall,
  debug_traceTransaction
} from '@/rpc/methods/debug_methods';

export const allHandlers = [
  zks_getAllAccountBalances,
  zks_getRawBlockTransactions,
  zks_getProof,
  eth_call,
  whoAmI,
  zks_sendRawTransactionWithDetailedOutput,
  eth_sendRawTransaction,
  debug_traceBlockByHash,
  debug_traceBlockByNumber,
  debug_traceCall,
  debug_traceTransaction,
];
