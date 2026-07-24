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
    marketProtocol: '0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846',
  },
  confirmations: 1,
  isTestnet: true,
  icon: 'giwa',
};
