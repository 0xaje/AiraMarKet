# Contract Deployment Guide
### Powered by GIWA

---

## 1. Executive Summary

### Why This Exists
Smart contract deployment, security parameters setup, and source code verification are critical to establishing the on-chain logic of a decentralized protocol. This **Contract Deployment Guide** exists to standardize deploy playbooks.

### What Problem It Solves
It eliminates manual compilation, error-prone transaction gas estimation, and complex constructor setups. By utilizing pre-configured Hardhat networks and verification scripts, the guide ensures that contract code is deployed consistently and verified correctly on explorer networks.

### Why It Matters
Automating and documenting deployment steps ensures that the contract deployer uses the correct compiler parameters, libraries, and access control configurations, preventing contract deployment bugs.

### How It Benefits GIWA
- **Streamlining GIWA Deployment**: Pre-configured configurations for the flagship **GIWA Sepolia** network allow developers to deploy and verify contracts with a single command, showcasing GIWA's developer-friendly tooling.

---

## 2. Deployment Playbook

### Prerequisites
Configure your local environment variables in `.env`:
- `PRIVATE_KEY`: Deployer wallet private key.

### Local Sandbox Deployment
To execute deployment tests on a local Hardhat node:
```bash
npx hardhat node
npx hardhat run scripts/deploy.cjs --network localhost
```

### Production Deployment to GIWA Sepolia
To deploy to the flagship network:
```bash
npm run deploy:giwa
```
This runs the compiled Hardhat deploy task using settings pre-configured in `hardhat.config.cjs`.

### Code Verification on GIWA Explorer
To verify the solidity source code on Dunamu's GIWA explorer:
```bash
npm run verify:giwa -- --contract contracts/AiraMarket.sol:AiraMarketProtocol <DEPLOYED_CONTRACT_ADDRESS>
```
