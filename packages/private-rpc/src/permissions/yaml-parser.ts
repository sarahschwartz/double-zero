import { z } from 'zod';
import { hexSchema } from '@/schemas/hex';
import { Group } from '@/permissions/group';
import { Authorizer } from '@/permissions/authorizer';
import { addressSchema } from '@/schemas/address';
import { Address, Hex, toFunctionSelector } from 'viem';
import {
  AccessRule,
  ArgumentIsCaller,
  GroupRule,
  OneOfRule,
  PublicRule,
} from '@/permissions/access-rules';
import { Permission } from '@/permissions/permission';

const publicSchema = z.object({ type: z.literal('public') });
const groupSchema = z.object({
  type: z.literal('group'),
  groups: z.array(z.string()),
});
const checkArgumentSchema = z.object({
  type: z.literal('checkArgument'),
  argIndex: z.number(),
});
const oneOfSchema = z.object({
  type: z.literal('oneOf'),
  rules: z.array(z.union([publicSchema, groupSchema, checkArgumentSchema])),
});

const ruleSchema = z.union([
  publicSchema,
  groupSchema,
  checkArgumentSchema,
  oneOfSchema,
]);
type Rule = z.infer<typeof ruleSchema>;

const methodSchema = z
  .object({
    selector: hexSchema.optional(),
    signature: z.string().optional(),
    read: ruleSchema,
    write: ruleSchema,
  })
  .refine((obj) => obj.signature !== undefined || obj.selector !== undefined);
type RawMethod = z.infer<typeof methodSchema>;

const yamlSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string(),
      members: z.array(addressSchema),
    }),
  ),

  contracts: z.array(
    z.object({
      address: addressSchema,
      methods: z.array(methodSchema),
    }),
  ),
});

export class YamlParser {
  private yaml: z.infer<typeof yamlSchema>;
  private groups: Group[];

  constructor(yaml: unknown) {
    this.yaml = yamlSchema.parse(yaml);
    this.groups = this.yaml.groups.map(
      ({ name, members }) => new Group(name, members),
    );
  }

  private extractSelector(method: RawMethod): Hex {
    if (method.selector !== undefined) {
      return method.selector;
    } else if (method.signature !== undefined) {
      return toFunctionSelector(method.signature);
    } else {
      throw new Error('cannot extract selector');
    }
  }

  private membersForGroup(groupName: string): Address[] {
    return (
      this.groups
        .filter((g) => g.name === groupName)
        .map((g) => g.members)
        .flat()
        .map((a) => addressSchema.parse(a)) || ([] as Address[])
    );
  }

  private hidrateRule(rule: Rule): AccessRule {
    switch (rule.type) {
      case 'public':
        return new PublicRule();
      case 'group':
        const members = rule.groups
          .map((name) => this.membersForGroup(name))
          .flat();
        return new GroupRule(members);
      case 'checkArgument':
        return new ArgumentIsCaller(rule.argIndex);
      case 'oneOf':
        const rules = rule.rules.map((r) => this.hidrateRule(r));
        return new OneOfRule(rules);
      default:
        throw new Error('Unknown rule type');
    }
  }

  parse(): Authorizer {
    const permissions = this.yaml.contracts.map((rawContract) => {
      const readPermissions = rawContract.methods.map((method) => {
        const selector = this.extractSelector(method);
        const readRule = this.hidrateRule(method.read);
        const writeRule = this.hidrateRule(method.write);

        return [
          Permission.contractRead(rawContract.address, selector, readRule),
          Permission.contractWrite(rawContract.address, selector, writeRule),
        ];
      });

      return readPermissions.flat();
    });

    return new Authorizer(permissions.flat());
  }
}
