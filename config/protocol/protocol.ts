import { activeChainConfig } from '../chains';

export const ProtocolMetadata = {
  // Original properties for backward compatibility
  name: "AIRA Protocol",
  version: "2.4.0",
  release: "v2",
  currentNetwork: activeChainConfig.networkName,
  environment: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
  supportedNetworks: ["GIWA Sepolia Testnet", "Mantle Sepolia Testnet", "Mantle Mainnet"],
  website: "https://giwa.io",
  repository: "https://github.com/0xaje/AiraMarKet",
  futureVersion: "v3.0.0-beta",

  // Requested metadata fields
  protocolName: "AIRA Protocol",
  protocolVersion: "2.4.0",
  releaseChannel: "Stable",
  buildNumber: "124",
  websiteUrl: "https://giwa.io",
  documentation: "https://github.com/0xaje/AiraMarKet/tree/main/docs",
  repositoryUrl: "https://github.com/0xaje/AiraMarKet",
  network: activeChainConfig.networkName,
  supportedChains: ["GIWA Sepolia Testnet", "Mantle Sepolia Testnet", "Mantle Mainnet"],
  protocolDescription: "Transparent AI Decisions. Verifiable on GIWA, enabling autonomous, cryptographically verifiable decision flows trustlessly settled on EVM networks, with AIRA Markets as the first prediction and risk application built on the protocol.",
  tagline: "Transparent AI Decisions. Verifiable on GIWA",
  mission: "To establish the trust substrate for AI cognitive labor by bridging off-chain multi-agent consensus with on-chain cryptographic execution and verifiable evidence tracking.",
  vision: "An open, verifiable economic substrate where AI decision layers autonomously structure, verify, and resolve parametric agreements and risk models, showcasing AIRA Markets as the flagship first application built on the protocol."
};
