/**
 * HederaMind backend test suite
 *
 * Usage:
 *   1. npm run dev        (start server in another terminal)
 *   2. npm test
 */

import dotenv from "dotenv";
dotenv.config();

const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
const SESSION = `test_session_${Date.now()}`;

// ─── Colour helpers ────────────────────────────────────────────────────────────
const green  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s: string) => `\x1b[2m${s}\x1b[0m`;

// ─── Test runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
let skipped = 0;

interface TestResult {
  name: string;
  status: "pass" | "fail" | "skip";
  detail?: string;
  durationMs?: number;
}

const results: TestResult[] = [];

// Delay between chat tests to avoid Gemini rate limits
const CHAT_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function test(
  name: string,
  fn: () => Promise<void>,
  skip = false
): Promise<void> {
  if (skip) {
    console.log(`  ${yellow("○")} ${dim(name)} ${yellow("[skipped]")}`);
    results.push({ name, status: "skip" });
    skipped++;
    return;
  }

  const start = Date.now();
  try {
    await fn();
    const ms = Date.now() - start;
    console.log(`  ${green("✓")} ${name} ${dim(`(${ms}ms)`)}`);
    results.push({ name, status: "pass", durationMs: ms });
    passed++;
  } catch (err) {
    const ms = Date.now() - start;
    const detail = err instanceof Error ? err.message : String(err);
    console.log(`  ${red("✗")} ${name}`);
    console.log(`    ${red("→")} ${detail}`);
    results.push({ name, status: "fail", detail, durationMs: ms });
    failed++;
  }
}

function section(title: string) {
  console.log(`\n${bold(title)}`);
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function post<T>(path: string, body: unknown): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as T;
  return { status: res.status, data };
}

async function get<T>(path: string): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json() as T;
  return { status: res.status, data };
}

async function del<T>(path: string): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  const data = await res.json() as T;
  return { status: res.status, data };
}

// ─── Use operator's own testnet account for live queries ───────────────────────
// This is always valid since it's the account that registered the agent
const TEST_ACCOUNT = "0.0.8064708";

// ─── Tests ─────────────────────────────────────────────────────────────────────
async function runAll() {
  console.log(bold("\n🧪  HederaMind Backend Test Suite"));
  console.log(dim(`    Base URL    : ${BASE}`));
  console.log(dim(`    Session     : ${SESSION}`));
  console.log(dim(`    Test account: ${TEST_ACCOUNT}`));
  console.log(dim(`    Chat delay  : ${CHAT_DELAY_MS}ms between requests`));
  console.log(dim(`    Started     : ${new Date().toLocaleTimeString()}\n`));

  // ── 1. Health ────────────────────────────────────────────────────────────────
  section("1. Health check");

  await test("GET /health returns 200", async () => {
    const { status, data } = await get<{ status: string }>("/health");
    assert(status === 200, `Expected 200, got ${status}`);
    assert((data as { status: string }).status === "ok", "status should be ok");
  });

  // ── 2. Agent info ────────────────────────────────────────────────────────────
  section("2. Agent info  (GET /api/agent/info)");

  await test("Returns agent profile with required fields", async () => {
    const { status, data } = await get<Record<string, unknown>>("/api/agent/info");
    assert(status === 200 || status === 404, `Unexpected status ${status}`);
    if (status === 200) {
      assert(typeof (data as { name: string }).name === "string", "missing name");
      assert(typeof (data as { agentId: string }).agentId === "string", "missing agentId");
      console.log(dim(`    → Agent: ${(data as { name: string }).name} (${(data as { agentId: string }).agentId})`));
    } else {
      console.log(dim("    → Agent not registered yet"));
    }
  });

  // ── 3. Chat — happy paths ───────────────────────────────────────────────────
  section("3. Chat — happy paths  (POST /api/chat)");
  console.log(dim(`  (${CHAT_DELAY_MS / 1000}s delay between each to respect rate limits)`));

  await test("HBAR price query", async () => {
    const { status, data } = await post<{ reply: string; toolsUsed: string[]; sessionId: string }>(
      "/api/chat",
      { message: "What is the current HBAR price?", sessionId: SESSION }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.reply.length > 0, "reply should be non-empty");
    assert(Array.isArray(data.toolsUsed), "toolsUsed should be array");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
    console.log(dim(`    → tools: ${data.toolsUsed.join(", ") || "none"}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("Network stats query", async () => {
    const { status, data } = await post<{ reply: string }>(
      "/api/chat",
      { message: "Show me Hedera network stats", sessionId: SESSION }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.reply.length > 0, "reply should be non-empty");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("Account balance query with operator account", async () => {
    const { status, data } = await post<{ reply: string; toolsUsed: string[] }>(
      "/api/chat",
      { message: `What is the HBAR balance of account ${TEST_ACCOUNT}?`, sessionId: SESSION }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.reply.length > 0, "reply should be non-empty");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("Transaction history query", async () => {
    const { status, data } = await post<{ reply: string }>(
      "/api/chat",
      { message: `Show me the last 3 transactions for account ${TEST_ACCOUNT}`, sessionId: SESSION }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.reply.length > 0, "reply should be non-empty");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("Off-topic question answered without tool call", async () => {
    const { status, data } = await post<{ reply: string; toolsUsed: string[] }>(
      "/api/chat",
      { message: "What is the capital of France?", sessionId: SESSION }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.reply.length > 0, "reply should be non-empty");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("Multi-turn — follow-up question", async () => {
    const sid = `multi_${Date.now()}`;

    const first = await post<{ reply: string }>(
      "/api/chat",
      { message: `What is the balance of account ${TEST_ACCOUNT}?`, sessionId: sid }
    );
    assert(first.status === 200, `First message failed: got ${first.status}`);
    await sleep(CHAT_DELAY_MS);

    const second = await post<{ reply: string }>(
      "/api/chat",
      { message: "When was that account created?", sessionId: sid }
    );
    assert(second.status === 200, `Follow-up failed: got ${second.status}`);
    assert(second.data.reply.length > 0, "follow-up reply empty");
    console.log(dim(`    → follow-up: ${second.data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  // ── 4. Chat — error cases (no Gemini calls — instant) ───────────────────────
  section("4. Chat — error & edge cases");

  await test("Empty message returns 400", async () => {
    const { status } = await post("/api/chat", { message: "", sessionId: SESSION });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test("Missing message field returns 400", async () => {
    const { status } = await post("/api/chat", { sessionId: SESSION });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test("Whitespace-only message returns 400", async () => {
    const { status } = await post("/api/chat", { message: "   ", sessionId: SESSION });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test("Invalid account ID handled gracefully", async () => {
    const { status, data } = await post<{ reply: string }>(
      "/api/chat",
      { message: "Get the balance of account NOTANACCOUNT", sessionId: SESSION }
    );
    assert(status === 200, `Expected graceful 200, got ${status}`);
    assert(data.reply.length > 0, "should return an explanation");
    console.log(dim(`    → ${data.reply.slice(0, 80)}`));
  });
  await sleep(CHAT_DELAY_MS);

  await test("No sessionId defaults to 'default'", async () => {
    const { status, data } = await post<{ sessionId: string }>(
      "/api/chat",
      { message: "Hello" }
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.sessionId === "default", `Expected sessionId='default', got '${data.sessionId}'`);
  });
  await sleep(CHAT_DELAY_MS);

  // ── 5. History (no Gemini calls) ─────────────────────────────────────────────
  section("5. Chat history  (GET /api/history/:sessionId)");

  await test("History has entries after chat", async () => {
    const { status, data } = await get<{ messages: unknown[]; count: number }>(
      `/api/history/${SESSION}`
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.messages), "messages should be array");
    assert(data.count > 0, "should have messages after chatting");
    console.log(dim(`    → ${data.count} messages in history`));
  });

  await test("History entries have correct shape", async () => {
    const { data } = await get<{
      messages: Array<{ role: string; content: string; timestamp: string }>;
    }>(`/api/history/${SESSION}`);
    const first = data.messages[0];
    assert(first.role === "user" || first.role === "agent", "role must be user or agent");
    assert(typeof first.content === "string", "content must be string");
    assert(typeof first.timestamp === "string", "timestamp must be string");
  });

  await test("Unknown session returns empty array", async () => {
    const { status, data } = await get<{ messages: unknown[]; count: number }>(
      "/api/history/nonexistent_session_xyz"
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.count === 0, "count should be 0");
  });

  await test("DELETE clears history", async () => {
    const sid = `clear_test_${Date.now()}`;
    await post("/api/chat", { message: "Hello", sessionId: sid });
    await sleep(CHAT_DELAY_MS);

    const before = await get<{ count: number }>(`/api/history/${sid}`);
    assert(before.data.count > 0, "should have messages before clear");

    await del(`/api/history/${sid}`);

    const after = await get<{ count: number }>(`/api/history/${sid}`);
    assert(after.data.count === 0, "should be empty after clear");
  });

  // ── 6. Registry (no Gemini calls) ────────────────────────────────────────────
  section("6. Registry  (GET /api/registry)");

  await test("GET /api/registry/agents returns array", async () => {
    const { status, data } = await get<{ agents: unknown[]; count: number }>(
      "/api/registry/agents"
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.agents), "agents should be array");
    console.log(dim(`    → ${data.count} agents in registry`));
  });

  await test("GET /api/registry/search?q= returns results", async () => {
    const { status, data } = await get<{ results: unknown[] }>(
      "/api/registry/search?q="
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(data.results), "results should be array");
  });

  await test("GET /api/registry/search?q=hedera filters", async () => {
    const { status, data } = await get<{ results: unknown[]; query: string }>(
      "/api/registry/search?q=hedera"
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.query === "hedera", "query echoed back");
    console.log(dim(`    → ${data.results.length} results for 'hedera'`));
  });

  // ── 7. Session management ────────────────────────────────────────────────────
  section("7. Session management");

  await test("DELETE /api/chat/session/:id clears session", async () => {
    const sid = `session_clear_${Date.now()}`;
    await post("/api/chat", { message: "Hello", sessionId: sid });
    await sleep(CHAT_DELAY_MS);

    const { status, data } = await del<{ cleared: boolean }>(
      `/api/chat/session/${sid}`
    );
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data.cleared === true, "cleared should be true");
  });

  // ── Summary ───────────────────────────────────────────────────────────────────
  const total = passed + failed + skipped;
  const duration = results.reduce((sum, r) => sum + (r.durationMs ?? 0), 0);

  console.log("\n" + "─".repeat(50));
  console.log(bold("Results"));
  console.log(
    `  ${green(`${passed} passed`)}  ${failed > 0 ? red(`${failed} failed`) : dim("0 failed")}  ${skipped > 0 ? yellow(`${skipped} skipped`) : dim("0 skipped")}  ${dim(`${total} total`)}`
  );
  console.log(dim(`  Total time: ${(duration / 1000).toFixed(1)}s`));

  if (failed > 0) {
    console.log(`\n${bold(red("Failed tests:"))}`);
    results
      .filter((r) => r.status === "fail")
      .forEach((r) => {
        console.log(`  ${red("✗")} ${r.name}`);
        if (r.detail) console.log(`    ${dim(r.detail)}`);
      });
    console.log();
    process.exit(1);
  } else {
    console.log(`\n${green("All tests passed")} 🎉\n`);
    process.exit(0);
  }
}

runAll().catch((err) => {
  console.error(red("Test runner crashed:"), err);
  process.exit(1);
});