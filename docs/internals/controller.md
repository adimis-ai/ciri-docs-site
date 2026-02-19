# Copilot Controller

The `CopilotController` is the primary interface for executing the CIRI agent graph. It handles conversation threads, state management, and multimodal input processing.

## The `run` Method

The `run` method is the core entry point for interacting with the agent. It accepts various input types and yields a stream of events from the LangGraph execution.

```python
async def run(
    self,
    inputs: Union[MessagesState, HumanMessage, Command],
    config: RunnableConfig,
    *,
    context: Optional[Any] = None,
    subgraphs: Optional[bool] = True,
    serialize: bool = False,
) -> AsyncGenerator[tuple[tuple[str, ...], str, Any], None]:
```

### Multimodal Input Support

CIRI supports passing multimodal content (audio, images, and files) through the `run` method. You can provide these either as LangChain `HumanMessage` objects or as raw dictionaries that follow the LangChain message format.

#### 1. Using `HumanMessage`

You can construct a `HumanMessage` with multiple content blocks:

```python
from langchain_core.messages import HumanMessage

# Message with Text and Audio
audio_message = HumanMessage(
    content=[
        {"type": "text", "text": "Transcribe this audio clip."},
        {
            "type": "audio",
            "url": "https://example.com/audio.mp3",
            "mime_type": "audio/mpeg"
        }
    ]
)

# Message with Text and a File (e.g., PDF)
file_message = HumanMessage(
    content=[
        {"type": "text", "text": "Summarize this document."},
        {
            "type": "file",
            "base64": "AAAAIGZ0eXBtcD...",  # Base64 encoded content
            "mime_type": "application/pdf"
        }
    ]
)

# Execute
async for namespace, stream_type, chunk in controller.run(audio_message, config):
    # Process stream...
```

#### 2. Using Dictionary Format

The `CopilotController` automatically deserializes dictionary inputs into the appropriate LangChain message types.

```python
inputs = {
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this file."},
                {
                    "type": "file",
                    "url": "https://example.com/data.csv",
                    "mime_type": "text/csv"
                }
            ]
        }
    ]
}

async for namespace, stream_type, chunk in controller.run(inputs, config):
    # Process stream...
```

### Supported Content Blocks

CIRI supports the standard LangChain content blocks:

| Type | Parameters | Default MIME Types |
|---|---|---|
| `text` | `text` | `text/plain` |
| `image` | `url`, `base64` | `image/jpeg`, `image/png` |
| `audio` | `url`, `base64` | `audio/mpeg`, `audio/wav` |
| `video` | `url`, `base64` | `video/mp4`, `video/webm` |
| `file` | `url`, `base64` | `application/pdf`, `text/csv`, etc. |

## Thread Management

The controller also provides helper methods for managing SQLite-backed conversation threads:

- `list_threads()`: Returns all available threads.
- `create_thread()`: Initializes a new persistent thread.
- `delete_thread(thread_id)`: Removes a thread and its history.
- `get_state(config)`: Retrieves the current Graph state for a thread.
