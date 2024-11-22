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
  debug_traceTransaction,
} from '@/rpc/methods/debug_methods';
import { forbiddenMethod, onlyCurrentUser } from '@/rpc/methods/utils';
import { eth_getLogs } from '@/rpc/methods/eth_getLogs';
import { eth_getBalance } from '@/rpc/methods/eth_getBalance';
import { eth_getBlockByHash, eth_getBlockByNumber } from '@/rpc/methods/eth_getBlockByNumber';
import { eth_getBlockReceipts } from '@/rpc/methods/eth_getBlockReceipts';
import { eth_getTransactionReceipt } from '@/rpc/methods/eth_getTransactionReceipt';

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
  eth_getLogs,
  eth_getBalance,
  eth_getBlockByNumber,
  eth_getBlockByHash,
  eth_getBlockReceipts,
  eth_getTransactionReceipt,
  forbiddenMethod('eth_newFilter'),
  forbiddenMethod('eth_newPendingTransactionFilter'),
  forbiddenMethod('eth_getStorageAt'),
  onlyCurrentUser('eth_getTransactionCount'),
  forbiddenMethod('eth_getTransactionByBlockHashAndIndex'),
];
