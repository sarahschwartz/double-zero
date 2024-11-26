import { Address, Hex } from 'viem';
import { AccessDeniedRule, AccessRule } from '@/permissions/access-rules';
import YAML from 'yaml';
import { YamlParser } from '@/permissions/yaml-parser';
import { Permission } from '@/permissions/permission';
import { extractSelector } from '@/rpc/methods';

export class Authorizer {
  permissions: Map<string, AccessRule>;

  constructor(permissions: Permission[]) {
    this.permissions = new Map();
    for (const permission of permissions) {
      this.permissions.set(permission.key, permission.rule);
    }
  }

  checkContractRead(address: Address, data: Hex, user: Address) {
    const method = extractSelector(data);
    const rule =
      this.permissions.get(`read_contract:${address}:${method}`) ||
      new AccessDeniedRule();
    return rule.canDo(user, data);
  }

  checkContractWrite(address: Address, data: Hex, user: Address) {
    const method = extractSelector(data);
    const rule =
      this.permissions.get(`write_contract:${address}:${method}`) ||
      new AccessDeniedRule();
    return rule.canDo(user, data);
  }

  static fromBuffer(buf: Buffer): Authorizer {
    const raw = YAML.parse(buf.toString());
    return new YamlParser(raw).parse();
  }
}
