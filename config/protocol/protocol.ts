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
  protocolDescription: "An autonomous, verifiable, agent-driven prediction market protocol running natively on high-performance EVM networks.",
  tagline: "Autonomous Intelligence & Risk Analysis Protocol",
  mission: "To automate and scale prediction market ecosystems by replacing manual curation and slow, centralized oracle settlements with autonomous, cryptographically auditable AI agent heuristics on high-performance Layer 2 chains.",
  vision: "A decentralized information layer where public knowledge, predictions, and outcomes are formulated programmatically and verified cryptographically without intermediary gatekeepers, enabling instantaneous, global risk management for any real-world event."
};
