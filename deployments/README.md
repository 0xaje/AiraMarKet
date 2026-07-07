# Smart Contract Deployment Registry

This directory stores verified deployment addresses and compiled contract ABIs for the AIRA Markets protocol, dynamically indexed by chain ID.

---

## 1. Network Deployment Status

| Network | Chain ID | Contract Address | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Mantle Sepolia Testnet** | `5003` | `0xdd277ccb8cda72d652cdca4df09df5f2522fc846` | ✅ **Live Production** | Fully operational and verified on-chain. |
| **Mantle Mainnet** | `5000` | — | ⏳ *Planned* | Mainnet target, no address deployed. |
| **GIWA Sepolia Testnet** | `91342` | `0xaa277ccb8cda72d652cdca4df09df5f2522fc846` | ⚠️ **Mock / Placeholder** | *Contracts are not physically deployed to the GIWA chain yet.* Using a standard mock address for network bootstrap validation. |

---

## 2. Placeholder Deployments Explanation

For the flagship network **GIWA Sepolia Testnet (91342)**, the address `0xaa277ccb8cda72d652cdca4df09df5f2522fc846` is configured as a bootstrap placeholder:
- The contract ABI stored in `deployments/91342/AiraMarketProtocol.ts` is identical to the verified `5003` (Mantle Sepolia) deployment.
- This placeholder allows developers to test client compilation, Wagmi connectors, and indexer start loops without incurring live transaction costs prior to official contract release on Dunamu's OP Stack.

---

## 3. Deployment Process

To deploy smart contracts to any EVM network independently, follow these steps:

1. **Configure Environment**: Make sure your deployer wallet private key is loaded in `.env`:
   ```bash
   PRIVATE_KEY="0x..."
   ```
2. **Execute Deployment Script**:
   - For **GIWA Network**:
     ```bash
     npm run deploy:giwa
     ```
   - For **Mantle Sepolia**:
     ```bash
     npx hardhat run scripts/deploy.cjs --network mantleTestnet
     ```
3. **Register Deployment Artifacts**:
   - Create a directory `/deployments/<CHAIN_ID>` matching the network chain ID.
   - Save the deployed address and compiled JSON ABI to `/deployments/<CHAIN_ID>/AiraMarketProtocol.ts` as `AiraMarketProtocolDeployment`.
   - Update `deployments/loader.ts` to register the new chain mapping.

---

## 4. Contract Verification Status

To verify the Solidity contract source code on the blockchain explorer:

- **Mantle Sepolia**: Verified on Blockscout/explorer. (Verify command is in deploy docs).
- **GIWA Sepolia**: Use the custom verification command:
  ```bash
  npm run verify:giwa -- --contract contracts/AiraMarket.sol:AiraMarketProtocol <DEPLOYED_CONTRACT_ADDRESS>
  ```
