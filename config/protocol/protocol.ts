import { activeChainConfig } from '../chains';

export const ProtocolMetadata = {
  name: "AIRA Protocol",
  version: "2.4.0",
  release: "v2",
  currentNetwork: activeChainConfig.networkName,
  environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
  supportedNetworks: ["GIWA Sepolia Testnet", "Mantle Sepolia Testnet", "Mantle Mainnet"],
  website: "https://giwa.io",
  repository: "https://github.com/0xaje/AiraMarKet",
  futureVersion: "v3.0.0-beta"
};
