import { Address } from 'viem';
import { addressSchema } from '@/schemas/address';

export interface AccessRule {
  canDo(user: Address, args: unknown[]): boolean;
}

export class PublicRule implements AccessRule {
  canDo(_address: Address): boolean {
    return true;
  }
}

export class AccessDeniedRule implements AccessRule {
  canDo(_address: Address): boolean {
    return false;
  }
}

export class GroupRule implements AccessRule {
  members: Set<Address>;

  constructor(members: Address[]) {
    this.members = new Set(members);
  }

  canDo(address: Address): boolean {
    return this.members.has(address);
  }
}

export class OneOfRule implements AccessRule {
  rules: AccessRule[];

  constructor(rules: AccessRule[]) {
    this.rules = rules;
  }

  canDo(user: Address, _args: unknown[]): boolean {
    return this.rules.some((rule) => rule.canDo(user, _args));
  }
}

export class ArgumentIsCaller implements AccessRule {
  argIndex: number;

  constructor(argIndex: number) {
    this.argIndex = argIndex;
  }

  canDo(user: Address, args: unknown[]): boolean {
    const arg = addressSchema.parse(args[this.argIndex]);
    return arg === user;
  }
}
