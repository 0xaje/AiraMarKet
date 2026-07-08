import { ChainConfig } from './types';

export const giwa: ChainConfig = {
  chainId: 91342,
  networkName: 'GIWA Sepolia Testnet',
  rpcUrl: 'https://sepolia-rpc.giwa.io',
  blockExplorer: 'https://sepolia-explorer.giwa.io',
  nativeCurrency: {
    name: 'GIWA',
    symbol: 'GIWA',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '0x4DbBd27F6e557860564bD1aa8e0596d62a2735C4',
  },
  confirmations: 1,
  isTestnet: true,
  icon: 'giwa',
};
