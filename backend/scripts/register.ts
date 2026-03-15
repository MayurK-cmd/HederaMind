import { registerAgent } from "../src/registration/registerAgent";
import { hasAgentState } from "../src/registration/agentState";
import { logger } from "../src/utils/logger";

async function main() {
  if (hasAgentState()) {
    logger.warn(
      "agent-state/agent.json already exists. Agent is already registered."
    );
    logger.warn(
      "Delete agent-state/agent.json and re-run if you want to re-register."
    );
    process.exit(0);
  }

  logger.info("Starting HederaMind agent registration...");

  try {
    await registerAgent();
    logger.info("Done. Start the server with: npm run dev");
  } catch (err) {
    logger.error("Registration failed", err);
    process.exit(1);
  }
}

main();