import { computed, ref } from 'vue';

import type {
  EnvironmentConfig,
  NetworkConfig,
  RuntimeConfig,
} from '@/configs';

import { env } from '@/configs/env';
import { BASE_TOKEN_L2_ADDRESS } from '@/utils/constants';
import { checksumAddress } from '@/utils/formatters';

const config = ref<EnvironmentConfig | null>(null);

export async function loadEnvironmentConfig(
  runtimeConfig: RuntimeConfig,
): Promise<void> {
  // runtime environment config takes precedence over hard coded config
  if (runtimeConfig.environmentConfig) {
    config.value = runtimeConfig.environmentConfig;
    return;
  }

  const envConfig: EnvironmentConfig = {
    networks: [
      {
        apiUrl: env.VITE_API_URL,
        rpcUrl: env.VITE_RPC_URL,
        name: env.VITE_NAME,
        icon: env.VITE_ICON,
        l2ChainId: env.VITE_L2_CHAIN_ID,
        l2NetworkName: env.VITE_L2_NETWORK_NAME,
        maintenance: env.VITE_MAINTENANCE,
        published: env.VITE_PUBLISHED,
        hostnames: env.VITE_HOSTNAMES,
        baseTokenAddress: env.VITE_BASE_TOKEN_ADDRESS,
        bridgeUrl: env.VITE_BRIDGE_URL,
        verificationApiUrl: env.VITE_VERIFICATION_API_URL,
        l1ExplorerUrl: env.VITE_L1_EXPLORER_URL,
        zkTokenAddress: env.VITE_ZK_TOKEN_ADDRESS,
        tokensMinLiquidity: env.VITE_TOKENS_MIN_LIQUIDITY,
      },
    ],
  };

  envConfig.networks?.forEach((networkConfig) => {
    networkConfig.baseTokenAddress = checksumAddress(
      networkConfig.baseTokenAddress || BASE_TOKEN_L2_ADDRESS,
    );
  });

  config.value = envConfig;
}

export default () => {
  return {
    networks: computed((): NetworkConfig[] =>
      config.value && Array.isArray(config.value.networks)
        ? config.value.networks // .filter((e) => e.published === true)
        : [],
    ),
  };
};
