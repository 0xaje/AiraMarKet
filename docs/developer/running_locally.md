# Running Locally

Follow these instructions to spin up the AIRA Markets protocol in a local developer sandbox.

## 1. Local Environment Setup

1. Copy `.env.example` (or configure `.env`):
   ```bash
   cp .env.example .env
   ```
2. Populate the required environment variables:
   - `PRIVATE_KEY`: Your test wallet private key.
   - `DATABASE_URL`: Your PostgreSQL database URL (Prisma).
   - `RPC_URL`: The RPC endpoint URL of the blockchain network.
   - `DEFAULT_CHAIN`: "giwa" or "mantleSepolia".

---

## 2. Start PostgreSQL Database & Migrations
Ensure your PostgreSQL instance is running and run Prisma migrations:
```bash
npx prisma db push
```

---

## 3. Run Backend Indexer & Server
To compile and boot the indexer, data ingestion pipeline, signal listeners, and transparency log API:
```bash
npm run server
```

---

## 4. Run Frontend React Client
In another terminal, start the Vite development server:
```bash
npm run dev
```
The client dashboard will be live at `http://localhost:5173`.
Connect your Web3 wallet (MetaMask/Rabby) and ensure it matches the active network configured in the backend environment.
