# Deploying Contracts

This guide walks through deploying the AIRA Markets smart contracts to EVM blockchains and verifying the source code.

## Prerequisites

Ensure the following variables are defined in your local `.env`:
- `PRIVATE_KEY`: Private key of the deployer wallet (must have gas funds).
- `MANTLE_EXPLORER_API_KEY`: API key for Blockscout/etherscan verification (if verifying).

---

## 1. Local Hardhat Node Deployment
For local sandbox testing, you can deploy to Hardhat's in-memory node:
```bash
npx hardhat node
npx hardhat run scripts/deploy.cjs --network localhost
```

---

## 2. Deploying to GIWA Network
Deploy using the dedicated script in `package.json`:
```bash
npm run deploy:giwa
```
This runs `npx hardhat run scripts/deploy.cjs --network giwa` using parameters defined in `hardhat.config.cjs`.

---

## 3. Deploying to Mantle Sepolia
Deploy using the default hardhat task:
```bash
npx hardhat run scripts/deploy.cjs --network mantleTestnet
```

---

## 4. Contract Source Code Verification

To verify the Solidity contract on the chain explorer:

### GIWA Network Verification
```bash
npm run verify:giwa -- --contract contracts/AiraMarket.sol:AiraMarketProtocol <DEPLOYED_CONTRACT_ADDRESS>
```

### Mantle Network Verification
```bash
npx hardhat verify --network mantleTestnet <DEPLOYED_CONTRACT_ADDRESS>
```
