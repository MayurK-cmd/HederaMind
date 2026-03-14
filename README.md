# HederaMind — AI Agent for the HOL Registry

> An on-chain AI agent registered in the Hashgraph Online (HOL) Registry that lets users query live Hedera network data through natural language. Built for the Apex Hackathon — Hashgraph Online Bounty ($8,000 + 100K HOL Points).

---

## What it does

HederaMind is a fully autonomous AI agent anchored to Hedera via HCS-10. Users interact with it through a React chat interface and ask questions in plain English. The agent reasons using Gemini 2.5 Pro, pulls live data from the Hedera Mirror Node, and responds with real on-chain information. Other agents can discover and message it through the HOL Registry.

**Example queries:**
- *"What is the HBAR balance of account 0.0.1234?"*
- *"Show me the last 5 transactions for this account"*
- *"What tokens does account 0.0.5678 hold?"*
- *"Find other AI agents in the HOL registry"*
- *"What is the current HBAR price and network stats?"*

---

## Architecture

```
React Frontend (Chat UI)
        │
        ▼
Express Backend (Node.js + TypeScript)
        │
        ├── LangChain Agent (Gemini 2.5 Pro via @langchain/google-genai)
        │       └── Tools: account, token, transaction, network, registry
        │
        ├── HCS10Client (@hashgraphonline/standards-sdk)
        │       ├── Inbound topic  — receives messages from users/agents
        │       └── Outbound topic — broadcasts agent responses
        │
        └── Hedera Mirror Node REST API
                └── Live on-chain data (balances, tokens, transactions)
```

The agent's identity is registered once on Hedera testnet via the HOL Registry. Its inbound/outbound HCS topic IDs are stored in `agent-state/` and loaded on every boot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI model | Gemini 2.5 Pro (`@langchain/google-genai`) |
| Agent framework | LangChain (`langchain`, `@langchain/core`) |
| Hedera SDK | `@hashgraph/sdk` |
| HOL integration | `@hashgraphonline/standards-sdk`, `@hashgraphonline/standards-agent-kit` |
| Backend | Node.js + TypeScript + Express |
| Frontend | React + Vite + TailwindCSS |
| On-chain data | Hedera Mirror Node REST API |

---

## Project Structure

```
hederamind/
│
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   │   ├── index.ts                 # LangChain agent init with Gemini
│   │   │   ├── systemPrompt.ts          # agent personality + instructions
│   │   │   └── tools/
│   │   │       ├── accountTools.ts      # get balance, account info
│   │   │       ├── tokenTools.ts        # token info, NFT lookup
│   │   │       ├── transactionTools.ts  # tx history, tx lookup
│   │   │       └── networkTools.ts      # HBAR price, network stats
│   │   │
│   │   ├── hedera/
│   │   │   ├── client.ts                # HCS10Client init
│   │   │   └── mirrorNode.ts            # Mirror Node REST helpers
│   │   │
│   │   ├── registration/
│   │   │   ├── registerAgent.ts         # one-time HOL registry registration
│   │   │   └── agentState.ts            # load/save agent JSON state
│   │   │
│   │   ├── messaging/
│   │   │   ├── listener.ts              # poll inbound HCS topic
│   │   │   └── responder.ts             # reply on connection topic
│   │   │
│   │   ├── routes/
│   │   │   ├── chat.ts                  # POST /api/chat
│   │   │   ├── agent.ts                 # GET  /api/agent/info
│   │   │   ├── history.ts               # GET  /api/chat/history
│   │   │   └── registry.ts              # GET  /api/registry/search
│   │   │
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── utils/
│   │   │   └── logger.ts
│   │   └── index.ts                     # Express entry point
│   │
│   ├── agent-state/                     # persisted agent JSON (gitignored)
│   ├── scripts/
│   │   └── register.ts                  # run ONCE to register agent
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── ToolCallBadge.tsx
│   │   │   └── StatusIndicator.tsx
│   │   ├── pages/
│   │   │   ├── Chat.tsx
│   │   │   └── AgentProfile.tsx
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── useAgent.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   └── agent-capabilities.md
│
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A free **Hedera testnet account** — create one at [portal.hedera.com](https://portal.hedera.com)
- A free **Google AI Studio API key** for Gemini — get one at [aistudio.google.com](https://aistudio.google.com)

No AWS. No credit card. No government ID.

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/hederamind.git
cd hederamind
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Hedera testnet — from portal.hedera.com
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e...
HEDERA_NETWORK=testnet

# Google Gemini — from aistudio.google.com
GOOGLE_API_KEY=AIza...

# HOL Registry
REGISTRY_URL=https://moonscape.tech

# These are set automatically after running the registration script below
AGENT_ID=
AGENT_INBOUND_TOPIC_ID=
AGENT_OUTBOUND_TOPIC_ID=
```

### 4. Register the agent on Hedera (run once)

This creates your agent's HCS topics and registers it in the HOL Registry. Only run this once — it costs a small amount of testnet HBAR.

```bash
npx ts-node scripts/register.ts
```

After it runs, copy the printed `AGENT_ID`, `AGENT_INBOUND_TOPIC_ID`, and `AGENT_OUTBOUND_TOPIC_ID` values into your `.env` file.

### 5. Start the backend

```bash
npm run dev
```

Backend runs on `http://localhost:3000`.

### 6. Install and start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message to the agent |
| `GET` | `/api/agent/info` | Get the agent's on-chain profile |
| `GET` | `/api/chat/history` | Get conversation history |
| `GET` | `/api/registry/search?q=` | Search other HOL-registered agents |

### Example: chat request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the HBAR balance of account 0.0.1234?"}'
```

```json
{
  "reply": "Account 0.0.1234 has a current HBAR balance of 142.5 ℏ. The account was created on March 2, 2024 and has been involved in 312 transactions.",
  "toolsUsed": ["getAccountBalance", "getAccountInfo"],
  "timestamp": "2025-03-14T10:22:00Z"
}
```

---

## Agent Capabilities

### Hedera account tools
- `getAccountBalance` — returns current HBAR balance for any account
- `getAccountInfo` — returns account creation date, key type, memo, and transaction count

### Token tools
- `getTokenInfo` — name, symbol, supply, treasury for any HTS token
- `getAccountTokens` — lists all tokens held by an account

### Transaction tools
- `getTransactionHistory` — last N transactions for an account
- `getTransactionById` — full details of a specific transaction by ID

### Network tools
- `getHbarPrice` — current HBAR/USD price from CoinGecko
- `getNetworkStats` — TPS, total transactions, active accounts

### Registry tools
- `searchHOLRegistry` — finds other registered agents by name or capability

---

## HOL Protocol Compliance

This agent is built to the HCS-10 standard:

- **Inbound topic** — other agents and users send connection requests and messages here
- **Outbound topic** — the agent broadcasts its responses here
- **HCS-11 profile** — on-chain identity card with name, description, and capabilities
- **Reachable via** — HCS-10, A2A, and MCP

The agent is discoverable in the HOL Registry at [hol.org/registry](https://hol.org/registry).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `HEDERA_ACCOUNT_ID` | Yes | Your Hedera testnet account ID |
| `HEDERA_PRIVATE_KEY` | Yes | Your Hedera testnet private key |
| `HEDERA_NETWORK` | Yes | `testnet` or `mainnet` |
| `GOOGLE_API_KEY` | Yes | Google AI Studio API key for Gemini |
| `REGISTRY_URL` | Yes | HOL registry URL (`https://moonscape.tech`) |
| `AGENT_ID` | Auto | Set after running `register.ts` |
| `AGENT_INBOUND_TOPIC_ID` | Auto | Set after running `register.ts` |
| `AGENT_OUTBOUND_TOPIC_ID` | Auto | Set after running `register.ts` |
| `PORT` | No | Backend port (default: `3000`) |

---

## Development Scripts

```bash
# Backend
npm run dev          # start with hot reload (ts-node + nodemon)
npm run build        # compile TypeScript
npm run start        # run compiled JS
npm run test         # run Jest tests

# Frontend
npm run dev          # Vite dev server with HMR
npm run build        # production build
npm run preview      # preview production build
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with sign-off: `git commit -s -m "feat: your message"`
4. Push and open a PR

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) spec. All commits must be GPG signed (`git commit -S`).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full process.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Bounty Submission

This project was built for the **Apex Hackathon — Hashgraph Online Bounty**.

- Bounty: Register & build a useful AI Agent in the HOL Registry Broker
- Prize: $8,000 + 100,000 HOL Points
- Requirements met:
  - Agent registered via `@hashgraphonline/standards-sdk`
  - Reachable via HCS-10
  - Natural language chat interface
  - Integrated with the Apex Hackathon decentralized application

---

*Built with Hedera, LangChain, Gemini, and the HOL Standards SDK.*