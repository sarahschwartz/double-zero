import { z, type ZodTypeAny } from 'zod';
import type { Address, Hex } from 'viem';

export const hexSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]*$/)
  .transform((data) => data as Hex);

export const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]*$/)
  .length(42)
  .transform((a) => a as Address);

export function enumeratedSchema<T extends ZodTypeAny>(parser: T) {
  return z.object({
    items: z.array(parser),
    meta: z.object({
      totalItems: z.number(),
      itemCount: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
    }),
    links: z.object({
      first: z.string(),
      previous: z.string(),
      next: z.string(),
      last: z.string(),
    }),
  });
}

export const tokenSchema = z.object({
  l2Address: hexSchema,
  l1Address: z.nullable(hexSchema),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  usdPrice: z.nullable(z.number()),
  liquidity: z.nullable(z.number()),
  iconURL: z.nullable(z.string()),
});
export type TokenData = z.infer<typeof tokenSchema>;

export const transferSchema = z
  .object({
    from: hexSchema,
    to: hexSchema,
  })
  .passthrough();

export const logsSchema = z.object({
  address: addressSchema,
  blockNumber: z.number(),
  logIndex: z.number(),
  data: hexSchema,
  timestamp: z.string(),
  topics: z.array(hexSchema),
  transactionHash: hexSchema,
  transactionIndex: z.number(),
});
