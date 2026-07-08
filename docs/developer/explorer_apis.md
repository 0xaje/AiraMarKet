# Protocol Explorer APIs Guide

This guide documents the REST APIs integrated to support the **Protocol Explorer**.

---

## 1. Unified Ledger Logs Endpoint

*   **Endpoint**: `GET /api/explorer/data`
*   **Method**: `GET`
*   **Access Level**: Open (Read-Only)
*   **Description**: Aggregates proposal, signal, evaluation, and transaction logs across database models and file-system transparency telemetry records.

### Response Payload Layout

```json
{
  "proposals": [
    {
      "id": 1,
      "signalId": "sig-example-100",
      "title": "Will SpaceX land Starship?",
      "category": "tech",
      "expiry": "1725148800",
      "confidence": 0.7662,
      "sentiment": "BULLISH",
      "status": "PENDING_APPROVAL",
      "ipfsHash": "QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s",
      "createdAt": "2026-07-08T14:18:36.507Z",
      "evaluations": [
        {
          "id": 1,
          "pendingMarketId": 1,
          "agentName": "AnalystAgent",
          "vote": "APPROVE",
          "confidence": 0.98,
          "reasoning": "Good trend signals",
          "createdAt": "2026-07-08T14:18:36.507Z"
        }
      ]
    }
  ],
  "evidencePackages": [
    {
      "id": 1,
      "signalId": "sig-example-100",
      "normalizedSignal": "{\"category\":\"tech\",\"topic\":\"SpaceX launch\",\"source\":\"NASA\",\"signal_strength\":90,\"sentiment\":\"bullish\"}",
      "sourceMetadata": "{\"origin\":\"NASA news feed\"}",
      "aiReasoningRef": "Initial tech feasibility checks",
      "confidenceInputs": 0.9,
      "createdAt": "2026-07-08T14:18:36.507Z"
    }
  ],
  "transparency": [
    {
      "timestamp": "2026-07-08T14:55:20.123Z",
      "txHash": "0xfeffed1ce8dadd72b9d27b8f460e37884076b9dcb9963e8c575a1185bc656bc2",
      "marketTitle": "Will SpaceX land Starship?",
      "category": "tech",
      "inputSignals": "sig-example-100",
      "aiReasoning": "Weighted consensus APPROVED (Weighted Score: 0.7184, Weighted Confidence: 0.7662, Probability: 63.4%).",
      "confidenceScore": 0.7662,
      "finalApprovalDecision": "APPROVED"
    }
  ],
  "ipfsUploads": [
    {
      "cid": "QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s",
      "latencyMs": 52,
      "provider": "Local IPFS Node"
    }
  ],
  "consensusAudits": [
    {
      "signalId": "sig-example-100",
      "weightedScore": 0.7184,
      "weightedConfidence": 0.7662,
      "approvalProbability": 0.634,
      "auditTrail": [
        {
          "agentName": "AnalystAgent",
          "vote": "APPROVE",
          "rawConfidence": 0.98,
          "adjustedConfidence": 0.98,
          "weight": 1.2,
          "accuracy": 0.92,
          "reputation": 95,
          "contributionWeight": 1.104
        }
      ],
      "timestamp": "2026-07-08T14:18:36.507Z"
    }
  ]
}
```

---

## 2. API Security Boundaries

*   **Read-Only Operations**: The endpoint does not write state to database systems or file logs.
*   **Rate Limits**: Endpoint uses default Express route rate limiting rules.
*   **No Mint/Admin Access**: The REST API exposes only historical logs and caches. It has no capabilities to invoke on-chain resolve methods or alter consensus weight registry overrides.
