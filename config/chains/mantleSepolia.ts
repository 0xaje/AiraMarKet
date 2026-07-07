import { ChainConfig } from './types';

export const mantleSepolia: ChainConfig = {
  chainId: 5003,
  networkName: 'Mantle Sepolia Testnet',
  rpcUrl: 'https://rpc.sepolia.mantle.xyz',
  blockExplorer: 'https://explorer.sepolia.mantle.xyz',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846',
  },
  confirmations: 1,
  isTestnet: true,
  icon: 'mantle',
};
