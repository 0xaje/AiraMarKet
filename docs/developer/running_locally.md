# Local Execution Playbook
### Powered by GIWA

---

## 1. Executive Summary

### Why This Exists
Developing high-throughput decentralized protocols requires a rapid-iteration local sandbox. This **Local Execution Playbook** exists to guide developers through setting up and running the AIRA Protocol.

### What Problem It Solves
It prevents system mismatches, unconfigured services, and database conflicts. By detailing step-by-step setup guides for PostgreSQL databases, indexers, and local client interfaces, the playbook ensures that developers can run the entire system locally with minimal friction.

### Why It Matters
A standardized development flow reduces setup overhead and ensures that developers can debug database integrations, test AI proposals, and verify contract trade execution in a safe local environment.

### How It Benefits GIWA
- **GIWA Sandbox Emulation**: This local playbook allows developers to test client interactions against GIWA network settings, enabling rapid prototyping for applications targeted for deployment on the GIWA ecosystem.

---

## 2. Sandbox Setup Playbook

### Step 1: Establish Environment Variables
Define the following parameters in your local `.env` file:
```bash
PRIVATE_KEY="0x..."
DATABASE_URL="postgresql://..."
RPC_URL="https://sepolia-rpc.giwa.io"
DEFAULT_CHAIN="giwa"
```

### Step 2: Synchronize Databases
Configure the PostgreSQL instance and synchronize the database schemas:
```bash
npx prisma db push
```

### Step 3: Run Backend Ingestion & Indexer
Start the autonomous AI agents, signal streams, and block polling indexer:
```bash
npm run server
```

### Step 4: Run Client Interface
Start the Vite development server in another shell:
```bash
npm run dev
```
The interface will be live at `http://localhost:5173`.
