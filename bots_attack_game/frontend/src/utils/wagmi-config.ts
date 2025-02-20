import { createWalletClient, custom } from "viem";
// import { zksyncInMemoryNode } from "viem/zksync";
import { createConfig } from "wagmi";
import { getAccount, readContract, simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const myWindow = window as any;

export const wagmiConfig = createConfig({
  chains: [
    // zksyncInMemoryNode,
    // zksyncLocalNode,
    {
      id: 0xD596,
      name: "Battleship Chain",
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [],
        },
      },
    },
  ],
  ssr: true,
  client: ({ chain }) =>
    createWalletClient({
      chain,
      transport: custom(myWindow.ethereum!),
    }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function writeGameContract(functionName: string, args: any[]) {
  const txHash = await writeContract(wagmiConfig, {
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName,
    args,
  });

  const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
    hash: txHash
  });
  console.log(`${functionName} RECEIPT:`, transactionReceipt);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readGameContract(functionName: string, args: any[]) {
  const from = getAccount(wagmiConfig).address;
  const result = await readContract(wagmiConfig, {
    account: from,
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName,
    args,
  });
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function simulateGameContract(functionName: string, args: any[]) {
  const resp = await simulateContract(wagmiConfig, {
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName,
    args,
  });

  console.log(`${functionName} SIMULATION:`, resp);
  return resp;
}
