import { activeChainConfig } from '../chains';

export const ProtocolMetadata = {
  // Original properties for backward compatibility
  name: "AIRA Protocol",
  version: "2.4.0",
  release: "v2",
  currentNetwork: activeChainConfig.networkName,
  environment: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
  supportedNetworks: ["GIWA Sepolia Testnet"],
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
  supportedChains: ["GIWA Sepolia Testnet"],
  protocolDescription: "AIRA Protocol is a verifiable AI decision protocol built on GIWA Sepolia that combines multi-agent reasoning, transparent evidence, and on-chain settlement into a complete MVP.",
  tagline: "A Multi-Agent AI Decision Protocol for Transparent Prediction Markets, powered by GIWA",
  mission: "AIRA allows multiple AI agents to independently evaluate the available evidence, explain their reasoning, reach consensus, preserve supporting evidence, and anchor that evidence on GIWA.",
  vision: "An open, verifiable economic substrate where AI decision layers structure, verify, and resolve parametric agreements and risk models, showcasing AIRA Markets as the flagship first application built on the protocol."
};
