import { Hex } from 'viem';

export function extractSelector(calldata: Hex): Hex {
  return calldata.substring(0, 10) as Hex;
}