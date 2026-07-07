# Troubleshooting

Common issues faced during development and deployment of the AIRA Markets protocol, alongside resolution diagnostics.

---

## 1. Network Validation Audit Failures on Startup

### Issue: "CRITICAL CONFIGURATION ERROR: Missing required environment variables"
- **Reason**: The backend server validates `PRIVATE_KEY`, `DATABASE_URL`, and `RPC_URL` at boot time to prevent partial executions.
- **Solution**: Open `.env` and verify that all three variables exist and contain non-empty values.

### Issue: "RPC Connection Failure"
- **Reason**: The RPC URL endpoint in `.env` or `config/chains/` is unreachable or rate-limited.
- **Solution**: Try querying the RPC URL manually via curl to verify it is responsive, or replace it with a public alternative.

---

## 2. Smart Contract Checksum Failures

### Issue: "bad address checksum" in Ethers
- **Reason**: EVM address configuration has mixed-case characters that do not match the expected EIP-55 checksum algorithm.
- **Solution**: Save the address in `.env` or configuration files in **all lowercase** (e.g. `0xaa27...`). Lowercase strings bypass checksum validation checks in Ethers.

---

## 3. Database Sync Warnings

### Issue: "Prisma db push failed"
- **Reason**: The PostgreSQL database URL provided in `DATABASE_URL` is offline, invalid, or has insufficient credentials.
- **Solution**: Confirm that PostgreSQL is running locally (or remote on Render) and matches the connection string. If you do not have a DB set up, ensure `USE_PRISMA=false` to utilize in-memory filesystem caches temporarily.
