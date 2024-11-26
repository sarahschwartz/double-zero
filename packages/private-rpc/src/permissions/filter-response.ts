import { AbiFunction, Address, decodeAbiParameters, Hex } from 'viem';

export interface ResponseFilter {
  canRead(user: Address, response: Hex): boolean;
}

export class ResponseIsCaller implements ResponseFilter {
  private index: number;
  private abi: AbiFunction;

  constructor(abi: AbiFunction, index: number) {
    this.abi = abi;
    this.index = index;
  }

  canRead(user: Address, response: Hex): boolean {
    const res = decodeAbiParameters(this.abi.outputs, response);
    const responseElement = res[this.index];
    return responseElement === user;
  }
}

export class NoFilter implements ResponseFilter {
  canRead(_user: Address, _response: Hex): boolean {
    return true;
  }
}
