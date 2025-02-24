export type NetworkConfig = {
  name: string;
  icon: string;
  verificationApiUrl?: string;
  apiUrl: string;
  rpcUrl: string;
  bridgeUrl?: string;
  l2NetworkName: string;
  l2ChainId: number;
  l1ExplorerUrl?: string;
  maintenance: boolean;
  published: boolean;
  hostnames: string[];
  tokensMinLiquidity?: number;
  zkTokenAddress?: string;
  baseTokenAddress: string;
};

export type EnvironmentConfig = {
  networks: NetworkConfig[];
};

export type RuntimeConfig = {
  version: string;
  sentryDSN: string;
  appEnvironment: string;
  environmentConfig?: EnvironmentConfig;
};
