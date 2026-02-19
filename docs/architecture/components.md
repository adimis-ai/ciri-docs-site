# Architecture - Components

CIRI's architecture is a modular stack where each component has a specific responsibility.

## Module Responsibilities

- **CLI Entry** (`src/__main__.py`): UI rendering, input handling, and initial environment sync.
- **The Brain** (`src/copilot.py`): Orchestrates the main agent graph and combines all middlewares.
- **The Controller** (`src/controller.py`): Manages conversation threads and graph execution state.
- **The Backend** (`src/backend.py`): Provides the execution engine for shell tools and browser automation.
- **Serialization** (`src/serializers.py`): Handles complex checkpointing and state persistence.

## Extension Layers

- **[Skills](skills-guide.md)**: Standard Python packages for focused tool capabilities.
- **[Toolkits](toolkits-guide.md)**: MCP-compliant servers for external system integrations.
- **[Subagents](subagents-guide.md)**: Specialized agents (`web_researcher`, `skill_builder`) delegated for complex tasks.

## Orchestration Fundamentals

CIRI relies on **LangGraph** for cycle-aware agent workflows and **LangChain** for model interoperability.

For a deeper technical look, see the **[Deep Dive](components-deep.md)**.
