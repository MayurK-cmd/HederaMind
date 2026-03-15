# Agent capabilities

HederaMind can answer natural language questions about the Hedera network by calling live Mirror Node APIs.

## Supported queries

### Account queries
| What to ask | Tool called |
|---|---|
| "What is the balance of 0.0.1234?" | `getAccountBalance` |
| "Tell me about account 0.0.5678" | `getAccountInfo` |

### Transaction queries
| What to ask | Tool called |
|---|---|
| "Show recent transactions for 0.0.1234" | `getTransactionHistory` |
| "Look up transaction 0.0.1234@1234567890.000000000" | `getTransactionById` |

### Token queries
| What to ask | Tool called |
|---|---|
| "What is token 0.0.9999?" | `getTokenInfo` |
| "What tokens does 0.0.1234 hold?" | `getAccountTokens` |

### Network queries
| What to ask | Tool called |
|---|---|
| "What is the HBAR price?" | `getHbarPrice` |
| "Show me network stats" | `getNetworkStats` |

## ID formats

| Type | Format | Example |
|---|---|---|
| Account ID | `shard.realm.num` | `0.0.1234` |
| Token ID | `shard.realm.num` | `0.0.5678` |
| Transaction ID | `account@seconds.nanos` | `0.0.1234@1234567890.000000000` |

## Limitations

- Read-only — the agent cannot send HBAR or sign transactions on your behalf
- Testnet only in this deployment — mainnet requires updating `HEDERA_NETWORK=mainnet` in `.env`
- No financial advice — the agent will not recommend buying or selling HBAR