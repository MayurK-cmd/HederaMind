# Architecture

## Overview

HederaMind is a full-stack AI agent registered on Hedera via the HCS-10 standard. It exposes a natural language chat interface backed by Gemini 2.0 Flash, with tool-augmented access to live Hedera network data via the Mirror Node REST API.

---

## System diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
│   ChatWindow · AgentCard · MessageBubble · ToolCallBadge    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP  POST /api/chat
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express Backend (Node.js)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              LangChain ReAct Agent                   │  │
│  │           (Gemini 2.0 Flash via @langchain/google-genai) │  │
│  │                                                      │  │
│  │  Tools:                                              │  │
│  │  • getAccountBalance   • getAccountInfo              │  │
│  │  • getTransactionHistory  • getTransactionById       │  │
│  │  • getTokenInfo        • getAccountTokens            │  │
│  │  • getHbarPrice        • getNetworkStats             │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │            Hedera Mirror Node REST API               │  │
│  │     testnet.mirrornode.hedera.com/api/v1             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                HCS10Client                           │  │
│  │       (@hashgraphonline/standards-sdk)               │  │
│  │                                                      │  │
│  │  • Inbound topic  — receives agent/user messages     │  │
│  │  • Outbound topic — broadcasts agent responses       │  │
│  │  • HOL Registry   — agent discoverable at hol.org    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HCS-10 (Hedera Consensus Service)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Hedera Testnet                           │
│                                                             │
│   Inbound topic ──── agent receives messages here           │
│   Outbound topic ─── agent broadcasts responses here        │
│   HOL Registry ───── agent listed and discoverable          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component breakdown

### Frontend (`/frontend`)

Built with React, Vite, and TailwindCSS. Communicates with the backend via a Vite proxy (`/api → localhost:3000`).

| Component | Purpose |
|---|---|
| `App.tsx` | Root layout — sidebar + chat area |
| `ChatWindow.tsx` | Message list, input bar, suggestion chips |
| `MessageBubble.tsx` | Renders user and agent messages |
| `ToolCallBadge.tsx` | Shows which Hedera tools the agent invoked |
| `AgentCard.tsx` | Displays the agent's on-chain identity |
| `StatusIndicator.tsx` | Online/offline pulse indicator |
| `useChat.ts` | Chat state, send logic, session management |
| `useAgent.ts` | Fetches agent info from backend on mount |

### Backend (`/backend/src`)

| Module | Purpose |
|---|---|
| `agent/index.ts` | LangChain ReAct agent init, `chat()` function, session history |
| `agent/systemPrompt.ts` | Agent personality and instructions |
| `agent/tools/*` | 8 LangChain tools wrapping Mirror Node + CoinGecko |
| `hedera/client.ts` | HCS10Client singleton |
| `hedera/mirrorNode.ts` | Typed Mirror Node REST helpers |
| `registration/registerAgent.ts` | One-time HOL registry registration |
| `registration/agentState.ts` | Persist/load agent JSON state |
| `messaging/listener.ts` | Polls inbound HCS topic every 5s |
| `messaging/responder.ts` | Submits replies to connection topics |
| `routes/chat.ts` | `POST /api/chat`, `DELETE /api/chat/session/:id` |
| `routes/agent.ts` | `GET /api/agent/info` |

---

## HCS-10 message flow

```
Other agent / user
        │
        │  JSON payload submitted to inbound topic
        ▼
Hedera Consensus Service (inbound topic)
        │
        │  Mirror Node REST API (polled every 5s)
        ▼
listener.ts
        │
        │  Decoded + parsed HCS-10 message
        ▼
agent/index.ts  ──►  Gemini 2.0 Flash  ──►  Mirror Node tools
        │
        ▼
responder.ts
        │
        │  Reply submitted to connection topic
        ▼
Hedera Consensus Service (connection topic)
        │
        ▼
Other agent / user receives reply
```

---

## Data sources

| Data | Source |
|---|---|
| Account balance | `GET /api/v1/accounts/{id}` — Hedera Mirror Node |
| Transaction history | `GET /api/v1/transactions?account.id={id}` — Hedera Mirror Node |
| Token info | `GET /api/v1/tokens/{id}` — Hedera Mirror Node |
| Account tokens | `GET /api/v1/accounts/{id}/tokens` — Hedera Mirror Node |
| HBAR price | CoinGecko public API |
| Network supply | `GET /api/v1/network/supply` — Hedera Mirror Node |

All data is fetched at query time — nothing is cached or stored.

---

## HOL Registry compliance

| Requirement | Implementation |
|---|---|
| Registered via HOL Standards SDK | `registerAgent.ts` uses `@hashgraphonline/standards-sdk` |
| Reachable via HCS-10 | Inbound + outbound topics created on Hedera |
| Natural language chat | React UI + Gemini 2.0 Flash via LangChain |
| Agent-to-agent messaging | `listener.ts` + `responder.ts` handle `op: message` and `op: connect` |
| Discoverable in registry | Agent profile submitted to HOL Registry topic on testnet |

---

## Security

- Private key is held only in `.env` and never logged or transmitted
- `.env` is gitignored — only `.env.example` is committed
- `agent-state/` is gitignored — topic IDs are environment-specific
- No user data is persisted — chat history lives in memory per session only
- Mirror Node is public and read-only — no write access to Hedera is exposed via the API