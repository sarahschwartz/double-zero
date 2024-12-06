import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const arraySchema = z
  .string()
  .transform((value) => value.split(','))
  .pipe(z.string().array());

const numberSchema = z
  .string()
  .transform((s) => parseInt(s, 10))
  .pipe(z.number());

const booleanSchema = z
  .string()
  .refine((s) => s === 'true' || s === 'false')
  .transform((s) => s === 'true');

export const env = createEnv({
  client: {
    VITE_API_URL: z.string().url(),
    VITE_APP_ENVIRONMENT: z.string().optional(),
    VITE_BASE_TOKEN_ADDRESS: z.string(),
    VITE_BRIDGE_URL: z.string().url(),
    VITE_HOSTNAMES: arraySchema,
    VITE_ICON: z.string(),
    VITE_L1_EXPLORER_URL: z.string().url().optional(),
    VITE_L2_CHAIN_ID: numberSchema,
    VITE_L2_NETWORK_NAME: z.string(),
    VITE_MAINTENANCE: booleanSchema,
    VITE_NAME: z.string(),
    VITE_PUBLISHED: booleanSchema,
    VITE_RPC_URL: z.string().url(),
    VITE_SENTRY_DSN: z.string().optional(),
    VITE_TOKENS_MIN_LIQUIDITY: numberSchema.optional(),
    VITE_VERIFICATION_API_URL: z.string().url().optional(),
    VITE_VERSION: z.string().optional(),
    VITE_ZK_TOKEN_ADDRESS: z.string().optional(),
  },
  clientPrefix: 'VITE_',
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
