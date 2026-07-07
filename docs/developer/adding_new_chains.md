# Adding New Chains

The AIRA Markets protocol utilizes a centralized configuration schema to support adding any EVM-compatible chain in minutes.

## Checklist to Integrate a New Chain

### 1. Define Chain Parameters
Create a network configuration file in `/config/chains/` (e.g. `/config/chains/arbitrum.ts`):
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

### 2. Register Chain in Registry
Import and add your chain configuration in `/config/chains/loader.ts`:
```typescript
import { arbitrum } from './arbitrum';

const chains: Record<string, ChainConfig> = {
  giwa,
  mantle,
  mantleSepolia,
  arbitrum, // Register here
};
```

### 3. Deploy Smart Contracts
Deploy the Solidity contract to the new network.
Create the deployment address/ABI file under `/deployments/<CHAIN_ID>/AiraMarketProtocol.ts` exporting `AiraMarketProtocolDeployment`.

### 4. Register Deployments Loader
Update `/deployments/loader.ts` to map the new Chain ID to the newly created deployment files:
```typescript
import { AiraMarketProtocolDeployment as arbitrumDeployment } from './42161/AiraMarketProtocol';

const deployments: Record<number, Record<string, { address: string; abi: any }>> = {
  91342: { AiraMarketProtocol: giwaDeployment },
  5003: { AiraMarketProtocol: mantleSepoliaDeployment },
  42161: { AiraMarketProtocol: arbitrumDeployment }, // Register here
};
```

### 5. Update Web3 Wallet Supported Lists
Add the new chain object definition to `/src/lib/network/index.ts` so RainbowKit displays the connector, and pass it to Wagmi's `chains` parameter.
