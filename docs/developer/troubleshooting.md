# Diagnostics & Troubleshooting Playbook
### System Maintenance & Log Analysis Guide

---

## 1. Startup Config Failures

### I. Missing Environment Variables
*   **Symptom**: System crashes during boot with error `CRITICAL CONFIGURATION ERROR: Missing required environment variables`.
*   **Reason**: The backend server validates environment config parameters at boot time to prevent partial executions.
*   **Resolution**: Verify that `PRIVATE_KEY`, `DATABASE_URL`, and `RPC_URL` are set and non-empty in your `.env` file.

---

## 2. Database Sync & Connectivity Issues

### I. Database Sync Failures
*   **Symptom**: `Prisma db push failed` or `database url is offline`.
*   **Reason**: The PostgreSQL service is unreachable, or credentials in the database connection string are incorrect.
*   **Resolution**: Confirm your PostgreSQL server is active. Double-check username/password variables inside your `DATABASE_URL` parameter in `.env`.

### II. Indexer State Desynchronization
*   **Symptom**: Client UI fails to update portfolio details, or duplicate transactions are listed in logs.
*   **Reason**: Out-of-order block ingestion or temporary RPC network disconnects.
*   **Resolution**: Ensure database sync uses transaction-level database idempotency. Check that the indexer uses transaction hashes as database primary keys, which automatically drops duplicate updates.

---

## 3. Network Latency & Timeout Errors

### I. RPC Endpoint Latency
*   **Symptom**: Logs display `RPC connection attempt failed` or connection timeouts.
*   **Reason**: The public RPC endpoint is unresponsive or rate-limited.
*   **Resolution**: Replace the public RPC URL in your registry configuration with a private or high-performance RPC endpoint.

---

## 4. Wallet & Contract Execution Reverts

### I. Checksum Address Violations
*   **Symptom**: Crash or error `bad address checksum` in Ethers.
*   **Reason**: EVM address configuration has mixed-case characters that fail EIP-55 checksum validation check.
*   **Resolution**: Open `.env` or configurations and save the contract address parameters in **all lowercase** (e.g. `0xaa27...`). All-lowercase strings bypass checksum validation checks in Ethers.

### II. User Signature Rejection or Insufficient Funds
*   **Symptom**: Application fails silently or returns vague stack traces.
*   **Resolution**: RainbowKit integrates Zustand notification alerts that catch the exact `err.shortMessage` from Viem, translating complex RPC codes into human-readable notifications with block explorer transaction links.
