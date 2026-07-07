# Adding New Chains
### Powered by GIWA

---

## 1. Executive Summary

### Why This Exists
EVM compatibility allows dApps to easily expand their user base. This **Multi-Chain Integration Playbook** exists to standardize the registration of new blockchain networks within the AIRA Protocol.

### What Problem It Solves
It eliminates hardcoded network assumptions and manual codebase refactoring. By providing a configuration-driven registry, the protocol allows developers to add support for any EVM-compatible chain (e.g. Arbitrum, Optimism, Base) in minutes, solely by editing registry settings.

### Why It Matters
A configuration-driven registry reduces deployment errors, simplifies multi-chain rollouts, and ensures that the backend indexer and client UI dynamically adapt to any selected chain.

### How It Benefits GIWA
- **Ensuring Flagship Primacy**: While multi-chain support is maintained, the protocol defaults to **GIWA Sepolia** as the flagship network. This highlights GIWA as the primary network, while demonstrating that the protocol remains compatible with the broader EVM ecosystem.

---

## 2. Integration Playbook

### Step 1: Define Network Configuration
Create a network parameters file in `/config/chains/` (e.g., `config/chains/arbitrum.ts`):
```typescript
import { ChainConfig } from './types';

export const arbitrum: ChainConfig = {
  chainId: 42161,
  networkName: 'Arbitrum One',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  blockExplorer: 'https://arbiscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '0x...',
  },
  confirmations: 2,
  isTestnet: false,
  icon: 'arbitrum',
};
```

### Step 2: Register in Chain Loader
Import and append the configuration to `/config/chains/loader.ts`:
```typescript
import { arbitrum } from './arbitrum';

const chains: Record<string, ChainConfig> = {
  giwa,
  mantle,
  mantleSepolia,
  arbitrum,
};
```

### Step 3: Register Deployment Artifacts
Save the contract deployment details to `/deployments/42161/AiraMarketProtocol.ts` and map it in `/deployments/loader.ts`:
```typescript
import { AiraMarketProtocolDeployment as arbitrumDeployment } from './42161/AiraMarketProtocol';

const deployments: Record<number, Record<string, { address: string; abi: any }>> = {
  91342: { AiraMarketProtocol: giwaDeployment },
  5003: { AiraMarketProtocol: mantleSepoliaDeployment },
  42161: { AiraMarketProtocol: arbitrumDeployment },
};
```
