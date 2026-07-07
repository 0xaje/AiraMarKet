import { ChainConfig } from './types';

export const mantle: ChainConfig = {
  chainId: 5000,
  networkName: 'Mantle Mainnet',
  rpcUrl: 'https://rpc.mantle.xyz',
  blockExplorer: 'https://explorer.mantle.xyz',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '', // Not deployed yet
  },
  confirmations: 2,
  isTestnet: false,
  icon: 'mantle',
};
