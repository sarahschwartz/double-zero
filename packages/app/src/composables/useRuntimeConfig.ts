import type { NetworkConfig, RuntimeConfig } from '@/configs';

import { env } from '@/configs/env';
import { checksumAddress } from '@/utils/formatters';
export const DEFAULT_NETWORK: NetworkConfig = {
  apiUrl: 'http://localhost:4040',
  verificationApiUrl: 'http://localhost:3070',
  bridgeUrl: '',
  hostnames: ['localhost'],
  icon: '/images/icons/zksync-arrows.svg',
  l1ExplorerUrl: '',
  l2ChainId: 54678,
  l2NetworkName: 'Local Game Chain',
  maintenance: false,
  name: 'localhost',
  published: true,
  rpcUrl: 'http://localhost:4041',
  baseTokenAddress: checksumAddress(
    '0x000000000000000000000000000000000000800A',
  ),
};

export default (): RuntimeConfig => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const runtimeConfig = window && window['##runtimeConfig'];

  return {
    version: env.VITE_VERSION || 'localhost',
    sentryDSN: runtimeConfig?.sentryDSN || env.VITE_SENTRY_DSN,
    appEnvironment:
      runtimeConfig?.appEnvironment || env.VITE_APP_ENVIRONMENT || 'default',
    environmentConfig: runtimeConfig?.environmentConfig,
  };
};
