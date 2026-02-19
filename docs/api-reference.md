# CIRI API Reference

CIRI provides a non-interactive **API mode** (`--api`) that allows backend servers and custom UI clients to interact with the CIRI copilot programmatically. The API uses a **persistent Unix socket server** for efficient resource reuse and **NDJSON (newline-delimited JSON)** for streaming responses.

---

## Table of Contents

- [Overview](#overview)
- [Server Mode](#server-mode)
- [Client Commands](#client-commands)
- [Protocol & Format](#protocol--format)
- [Examples](#examples)
- [Error Handling](#error-handling)

---

## Overview

### Architecture

The API operates in **server-client mode**:

1. **Server** (`ciri --api --server`) — starts once and holds the copilot in memory via Unix socket at `~/.local/share/ciri/ciri-api.sock`
2. **Clients** (all other `ciri --api` commands) — connect to the server, send commands, and receive NDJSON responses
3. **Auto-start** — if no server is running, clients automatically spawn one in the background

### Why Server Mode?

- **Resource Efficiency**: The copilot (LLM, graph, checkpoints) is compiled once, not per CLI invocation
- **Fast Responses**: Subsequent commands reuse the initialized copilot
- **State Persistence**: Threads and conversation history remain across API calls
- **Central Control**: Model and browser profile changes rebuild the copilot once, benefiting all clients

### Transport

- **Unix Domain Socket** — high-performance IPC at `~/.local/share/ciri/ciri-api.sock`
- **NDJSON Protocol** — one JSON object per line, `\n`-terminated
- **Async I/O** — full support for concurrent client connections

---

## Server Mode

### Starting the Server

```bash
# Start server with default settings
ciri --api --server

# Start with a specific model
ciri --api --server --config '{"model": "anthropic/claude-opus-4-6"}'

# Start with all interrupts disabled (auto-approve tool actions)
ciri --api --server --all-allowed

# Start with a specific browser profile
ciri --api --server --config '{"browser_profile": {"browser": "chrome", "profile_directory": "Default"}}'
```

### Server Lifecycle

The server:
- Creates socket at `~/.local/share/ciri/ciri-api.sock`
- Writes its PID to `~/.local/share/ciri/ciri-api.pid`
- Runs indefinitely, accepting client connections
- Cleans up socket and PID file on shutdown

To stop the server:
```bash
kill $(cat ~/.local/share/ciri/ciri-api.pid)
```

---

## Client Commands

All client commands **automatically start the server if not running** (with configurable delays).

### `ciri --api --health`

Quick health check. Returns `{"status": "ok"}`.

```bash
ciri --api --health
# Output: {"status": "ok"}
```

### `ciri --api --run`

Execute a graph run with user input and stream NDJSON events.

**Parameters:**
- `--input <JSON>` (required) — User input dict, typically `{"messages": [...]}`
- `--config <JSON>` (optional) — RunnableConfig with thread ID; auto-creates if absent
- `--subgraphs` / `--no-subgraphs` (optional, default: enabled) — Include subgraph events
- `--context <JSON>` (optional) — Additional context passed to the graph

**Example:**
```bash
ciri --api --run \
  --input '{"messages": [{"type": "human", "content": "What is 2+2?"}]}' \
  --config '{"configurable": {"thread_id": "my-thread-123"}}'
```

**Output (NDJSON stream):**
```json
{"type": "messages", "namespace": ["agent"], "data": {"message": {"type": "ai", "content": "2+2 equals..."}, "metadata": {...}}}
{"type": "updates", "namespace": ["agent"], "data": {"agent": {"messages": [...]}}}
{"type": "done"}
```

### `ciri --api --state`

Retrieve the current serialized state of a thread.

**Parameters:**
- `--config <JSON>` (required) — RunnableConfig with thread ID

**Example:**
```bash
ciri --api --state --config '{"configurable": {"thread_id": "my-thread-123"}}'
```

**Output (single JSON object):**
```json
{
  "config": {"configurable": {"thread_id": "my-thread-123"}},
  "values": {"messages": [...]},
  "next": [],
  "metadata": {...},
  "created_at": "2026-02-19T10:30:00Z",
  "tasks": [],
  "interrupts": []
}
```

### `ciri --api --history`

Stream historical state snapshots for a thread.

**Parameters:**
- `--config <JSON>` (required) — RunnableConfig with thread ID
- `--filter <JSON>` (optional) — LangGraph filter dict (passed to `get_state_history`)
- `--before <JSON>` (optional) — Cursor RunnableConfig for pagination
- `--limit <INT>` (optional) — Maximum number of snapshots to return

**Example:**
```bash
ciri --api --history \
  --config '{"configurable": {"thread_id": "my-thread-123"}}' \
  --limit 5
```

**Output (NDJSON stream, one per line):**
```json
{"config": {...}, "values": {...}, "next": [], "metadata": {...}}
{"config": {...}, "values": {...}, "next": [], "metadata": {...}}
{"type": "done"}
```

### `ciri --api --change-model`

Rebuild the server's copilot with a new model (in-place, same checkpointer/db).

**Parameters:**
- Model name as positional argument, e.g., `openai/gpt-5` or `anthropic/claude-opus-4-6`

**Example:**
```bash
ciri --api --change-model 'anthropic/claude-opus-4-6'
```

**Output:**
```json
{"type": "status", "ok": true, "data": {"model": "anthropic/claude-opus-4-6"}}
{"type": "done"}
```

**Side effects:**
- Updates `~/.ciri/settings.json` with new model
- Rebuilds graph with new model, reusing db and checkpointer
- All future `--run` commands use the new model

### `ciri --api --change-browser-profile`

Rebuild the server's copilot with a new browser profile.

**Parameters:**
- Browser profile as JSON positional argument, e.g., `'{"browser": "chrome", "profile_directory": "Default"}'`

**Example:**
```bash
ciri --api --change-browser-profile '{"browser": "edge", "profile_directory": "Default"}'
```

**Output:**
```json
{"type": "status", "ok": true, "data": {"profile": {"browser": "edge", "profile_directory": "Default"}}}
{"type": "done"}
```

**Side effects:**
- Updates `~/.ciri/settings.json` with new profile
- Rebuilds graph with new browser config
- Web research tools use the new browser

---

## Protocol & Format

### Request Format

Clients send **one JSON line per command**:

```json
{"cmd": "run", "input": {...}, "config": {...}, "subgraphs": true, "context": null}
{"cmd": "state", "config": {...}}
{"cmd": "history", "config": {...}, "filter": null, "before": null, "limit": 10}
{"cmd": "change_model", "model": "openai/gpt-5"}
{"cmd": "change_browser_profile", "profile": {"browser": "chrome", "profile_directory": "Default"}}
{"cmd": "health"}
{"cmd": "shutdown"}
```

### Response Format

The server streams **NDJSON responses**. Common response types:

| Type | Purpose | Example |
|---|---|---|
| `messages` | Token-by-token AI message chunks | `{"type": "messages", "namespace": ["agent"], "data": {"message": {...}, "metadata": {...}}}` |
| `updates` | Node state updates | `{"type": "updates", "namespace": ["agent"], "data": {...}}` |
| `snapshot` | Historical state snapshot | `{"type": "snapshot", "data": {...}}` |
| `state` | Current thread state | `{"type": "state", "data": {...}}` |
| `status` | Command completion | `{"type": "status", "ok": true, "data": {...}}` |
| `error` | Error message | `{"type": "error", "error": "message"}` |
| `done` | End of response stream | `{"type": "done"}` |

**Important**: Always read until `{"type": "done"}` to know when the server is finished sending.

---

## Examples

### Example 1: Simple Conversation

```bash
# Start server
ciri --api --server &
sleep 2

# Send a message
ciri --api --run \
  --input '{"messages": [{"type": "human", "content": "Hello"}]}'

# Output: NDJSON stream of events ending with {"type": "done"}
```

### Example 2: Resume a Thread

```bash
# Get state of a previous thread
ciri --api --state --config '{"configurable": {"thread_id": "my-thread-123"}}'

# Continue that thread
ciri --api --run \
  --input '{"messages": [{"type": "human", "content": "Tell me more"}]}' \
  --config '{"configurable": {"thread_id": "my-thread-123"}}'
```

### Example 3: Custom UI Backend

```python
import json
import asyncio
import sys

async def call_ciri_api(cmd_dict):
    """Send a command to CIRI API server."""
    socket_path = Path.home() / ".local" / "share" / "ciri" / "ciri-api.sock"

    reader, writer = await asyncio.open_unix_connection(str(socket_path))
    writer.write((json.dumps(cmd_dict) + "\n").encode())
    await writer.drain()

    results = []
    while True:
        line = await reader.readline()
        obj = json.loads(line.decode())
        if obj.get("type") == "done":
            break
        results.append(obj)

    return results

# Usage
response = await call_ciri_api({
    "cmd": "run",
    "input": {"messages": [{"type": "human", "content": "Hi"}]},
})
for event in response:
    print(event)
```

### Example 4: Model Switching

```bash
# Check current model
ciri --api --health

# Switch to a new model
ciri --api --change-model 'openai/gpt-5'

# Verify future runs use new model
ciri --api --run --input '{"messages": [...]}'
```

---

## Error Handling

### Error Response Format

All errors are returned as NDJSON:
```json
{"type": "error", "error": "human-readable error message"}
{"type": "done"}
```

### Common Errors

| Scenario | Error Message |
|---|---|
| Missing required parameter | `--run requires --input` |
| Invalid JSON | `--input is not valid JSON: ...` |
| Server not running (and auto-start failed) | `Server did not start within 10 seconds` |
| Socket connection refused | `Cannot connect to server: ...` |
| Unknown command | `Unknown command: xyz` |

### Exit Codes

- **0** — Success
- **1** — Error (invalid args, server connection failed, etc.)

---

## Performance Notes

### Initialization Time

The server takes **10-30 seconds** to start because:
- Model availability checks
- Browser CDP setup attempts
- LangGraph agent graph compilation

After startup, subsequent API calls are **fast** (milliseconds).

### Resource Usage

- **Memory**: ~1-2 GB (LLM + graph + database)
- **Disk**: ~100 MB (checkpoints, skills)
- **CPU**: Minimal at idle, scales with model inference

### Concurrency

The server handles **multiple concurrent client connections** safely. Each client can:
- Stream the same run in parallel
- Query different threads independently
- Rebuild the copilot (queued, not concurrent)

---

## Configuration

### Model Selection

Models are resolved in this order:
1. `--config` flag at server startup (e.g., `--config '{"model": "anthropic/claude-opus-4-6"}'`)
2. Last saved model in `~/.ciri/settings.json`
3. `DEFAULT_MODEL` constant in code (`openai/gpt-5-mini`)

### API Keys

Set environment variables before starting the server:
```bash
export OPENROUTER_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
# etc.
ciri --api --server
```

### Browser Profiles

Browser profiles must be valid Chrome/Edge profiles on your system. Profile directories can be found at:
- Chrome: `~/.config/google-chrome/` (Linux) or `~/Library/Application Support/Google/Chrome/` (macOS)
- Edge: `~/.config/microsoft-edge/` (Linux) or similar (macOS)

Provide the profile directory name (e.g., `"Default"`, `"Profile 1"`).

---

## Socket Path Override

To use a custom socket path (advanced use):

```bash
# Not yet implemented, but can be added if needed:
# ciri --api --server --socket /tmp/custom-ciri.sock
```

For now, the socket is always at `~/.local/share/ciri/ciri-api.sock`.
