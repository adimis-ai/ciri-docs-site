# Architecture - Components (Deep Dive)

This page provides a high-resolution view of the CIRI internals and their implementation details.

## Detailed Boot Sequence

The CLI initialization follows a strict sequence to ensure all local capabilities are hot-loaded correctly:

1. **CLI Start** (`src/__main__.py`): Loads `.env`, settings, and triggers `sync_default_skills()`.
2. **Graph Compilation** (`create_copilot` in `src/copilot.py`):
   - Initializes the `LLMConfig`.
   - Connects to the **[Web Research](features/web-research.md)** CDP endpoint.
   - Builds specialized builders (**Skill**, **Toolkit**, **SubAgent**, and **Trainer**).
   - Injects **[Memory](features/memory.md)** and **[Skills](skills-guide.md)** via the middleware stack.
3. **Controller Hand-off** (`src/controller.py`): Wraps the graph in a thread-safe execution interface.

## The Middleware Stack

CIRI uses a recursive middleware pattern where each subagent inherits the capabilities of the main copilot:

- `ToolkitInjectionMiddleware`: Discovers and injects MCP servers on-the-fly.
- `SkillsMiddleware`: Scans `.ciri/skills/` and provides them as standard tools.
- `MemoryMiddleware`: Reads workspace-local markdown files for long-term context.
- `SubAgentMiddleware`: The "Router" that delegates to specialists like the `web_researcher`.

## Advanced Implementation Notes

- **Self-Evolution** (`src/subagents/trainer_agent.py`): Uses a multi-step planning loop to design and implement new skills. See the **[Self-Evolution guide](internals/self-evolution.md)** for more.
- **State Persistence** (`src/serializers.py`): Implements custom JSON serializers (`CiriJsonPlusSerializer`) to handle complex Python types (locks, threads, etc.) during checkpointing.
- **Browser Automation** (`src/utils.py` and `src/toolkit/crawler.py`): Provides the CDP bridge that allows the `web_researcher` to drive your real browser.

## Developer Pointers

- **Custom Middlewares**: Add new layers in `create_copilot()` within `src/copilot.py`.
- **Tool Logic**: Implement new core tools as LangChain `@tool` functions and add them to the `merged_tools` list in `src/copilot.py`.
- **Autocomplete**: Extend `CiriCompleter` in `src/__main__.py` to handle new interactive triggers.
