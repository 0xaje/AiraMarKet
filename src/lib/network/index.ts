import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, injectedWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { activeChainConfig } from '../../../config/chains';
import { getDeployment } from '../../../deployments/loader';
import { ProtocolMetadata } from '../../../config/protocol/protocol';

// Define all supported chains explicitly
export const giwaChain = defineChain({
  id: 91342,
  name: 'GIWA Sepolia Testnet',
  nativeCurrency: { name: 'GIWA', symbol: 'GIWA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia-rpc.giwa.io'] },
    public: { http: ['https://sepolia-rpc.giwa.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://sepolia-explorer.giwa.io',
    },
  },
  testnet: true,
});

// Select active chain from dynamic config
export const activeChain = giwaChain;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Supported Wallets',
      wallets: [injectedWallet, metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: ProtocolMetadata.protocolName,
    projectId: 'f36f7f706a5807add3b4bb181ba4f9ea',
  }
);

export const config = createConfig({
  connectors,
  chains: [giwaChain],
  transports: {
    [giwaChain.id]: http(giwaChain.rpcUrls.default.http[0]),
  },
});

// Chain helpers
export const getActiveChainId = () => activeChainConfig.chainId;
export const getActiveNetworkName = () => activeChainConfig.networkName;

// Explorer helpers
export const getBlockExplorerUrl = () => activeChainConfig.blockExplorer;
export const getTxExplorerUrl = (txHash: string) => `${activeChainConfig.blockExplorer}/tx/${txHash}`;
export const getAddressExplorerUrl = (address: string) => `${activeChainConfig.blockExplorer}/address/${address}`;

// RPC helpers
export const getRpcUrl = () => activeChainConfig.rpcUrl;

// Currency symbol helper
export const getNativeCurrencySymbol = () => activeChainConfig.nativeCurrency.symbol;

// Contract address helper
export const getContractAddress = (name: string = 'marketProtocol') => {
  return activeChainConfig.contracts[name] || activeChainConfig.contracts['marketProtocol'];
};

// Contract ABI helper
export const getContractAbi = (name: string = 'marketProtocol') => {
  const dep = getDeployment(activeChainConfig.chainId, name);
  return dep ? dep.abi : [];
};

