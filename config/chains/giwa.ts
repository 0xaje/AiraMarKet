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
    marketProtocol: '0xBDCd79e468a05BaD60cc0822Df42c11B4e0E4f3D',
  },
  confirmations: 1,
  isTestnet: true,
  icon: 'giwa',
};
