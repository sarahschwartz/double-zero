import { z } from 'zod';

export const modulesEnum = z.enum([
  'contract',
  'transaction',
  'account',
  'block',
  'log',
  'token',
  'stat',
]);

export type ModuleName = z.infer<typeof modulesEnum>;
