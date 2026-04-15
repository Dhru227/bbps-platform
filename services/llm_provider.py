import os
import httpx

# -------------------------------------------------------------------
# LLM Provider Abstraction
# -------------------------------------------------------------------
# Controlled by two env vars:
#
#   LLM_PROVIDER=ollama        (default)
#   LLM_PROVIDER=openrouter
#
# For Ollama (local):
#   OLLAMA_BASE_URL=http://localhost:11434   (default)
#   OLLAMA_MODEL=llama3                      (default)
#
# For OpenRouter:
#   OPENROUTER_API_KEY=sk-or-...             (required)
#   OPENROUTER_MODEL=mistralai/mistral-7b-instruct   (default)
#
# To switch providers: change LLM_PROVIDER in .env and restart.
# No code changes needed.
# -------------------------------------------------------------------

PROVIDER = os.getenv("LLM_PROVIDER", "ollama").lower()


def _call_ollama(system_prompt: str, messages: list, max_tokens: int) -> str:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "llama3")

    full_messages = [{"role": "system", "content": system_prompt}] + messages

    payload = {
        "model": model,
        "messages": full_messages,
        "stream": False,
        "options": {"num_predict": max_tokens},
        "think": False  # disable thinking mode for qwen3 reasoning models
    }

    try:
        r = httpx.post(f"{base_url}/api/chat", json=payload, timeout=180)
        r.raise_for_status()
    except httpx.RequestError as e:
        raise RuntimeError(f"Cannot reach Ollama at {base_url}. Is it running? Error: {e}")
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Ollama returned {e.response.status_code}: {e.response.text}")

    content = r.json()["message"]["content"]
    if not content:
        raise RuntimeError("LLM returned empty response. Try a different model.")
    return content

def _call_openrouter(system_prompt: str, messages: list, max_tokens: int) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set in .env")

    model = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct")

    full_messages = [{"role": "system", "content": system_prompt}] + messages

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",   # required by OpenRouter
        "X-Title": "BBPS Platform"
    }

    payload = {
        "model": model,
        "messages": full_messages,
        "max_tokens": max_tokens
    }

    try:
        r = httpx.post("https://openrouter.ai/api/v1/chat/completions",
                       headers=headers, json=payload, timeout=60)
        r.raise_for_status()
    except httpx.RequestError as e:
        raise RuntimeError(f"Cannot reach OpenRouter: {e}")
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"OpenRouter returned {e.response.status_code}: {e.response.text}")

    return r.json()["choices"][0]["message"]["content"]


def call_llm(system_prompt: str, messages: list, max_tokens: int = 300) -> str:
    """
    Single entry point for all LLM calls.
    system_prompt : str   — injected as system role
    messages      : list  — [{"role": "user"|"assistant", "content": "..."}]
    max_tokens    : int   — response length cap
    """
    if PROVIDER == "openrouter":
        return _call_openrouter(system_prompt, messages, max_tokens)
    elif PROVIDER == "ollama":
        return _call_ollama(system_prompt, messages, max_tokens)
    else:
        raise RuntimeError(f"Unknown LLM_PROVIDER '{PROVIDER}'. Must be 'ollama' or 'openrouter'.")