import { z } from 'zod';
import { addressSchema, hexSchema } from '../../utils/schemas.js';

export const modulesEnum = z.enum([
  'contract',
  'transaction',
  'account',
  'block',
  'logs',
  'token',
  'stats',
]);

export type ModuleName = z.infer<typeof modulesEnum>;

export const withAddressSchema = z.object({
  address: addressSchema,
});

export const publicTxSchema = z.union([
  z.object({
    status: z.literal('1'),
    message: z.string(),
    result: z.array(
      z
        .object({
          from: addressSchema,
          to: addressSchema,
        })
        .passthrough(),
    ),
  }),
  z.object({
    status: z.literal('0'),
    message: z.string(),
    result: z.any(),
  }),
]);

export const publicLogSchema = z.union([
  z.object({
    status: z.literal('1'),
    message: z.string(),
    result: z.array(
      z
        .object({
          topics: z.array(hexSchema),
        })
        .passthrough(),
    ),
  }),
  z.object({
    status: z.literal('0'),
    message: z.string(),
    result: z.any(),
  }),
]);

export const numberSchema = z.coerce.number().optional();
