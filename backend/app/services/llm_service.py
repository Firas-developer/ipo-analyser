import json
import time
from typing import Dict, Any

from app.core.config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

try:
    from google import genai
except ImportError:
    genai = None


class LLMError(Exception):
    pass


def _get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise LLMError("GEMINI_API_KEY is not set. Please add it to your .env file.")
    if genai is None:
        raise LLMError("google-genai package is not installed. Run: pip install google-genai")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def _get_groq_client() -> Groq:
    if not settings.GROQ_API_KEY:
        raise LLMError("GROQ_API_KEY is not set. Please add it to your .env file.")
    if Groq is None:
        raise LLMError("groq package is not installed. Run: pip install groq")
    return Groq(api_key=settings.GROQ_API_KEY)


def call_gemini_llm(prompt: str) -> Dict[str, Any]:
    """
    Call Google Gemini API and expect JSON output with retry logic.
    """
    max_retries = 3
    retry_delay = 2
    
    # Log the prompt being sent
    print("\n" + "="*80)
    print(" SENDING TO GEMINI API")
    print("="*80)
    print(f"Model: {settings.GEMINI_MODEL}")
    print(f"Prompt Length: {len(prompt)} characters")
    print(f"Temperature: 1")
    print(f"Max Tokens: 8192")
    print("\n--- PROMPT CONTENT ---")
    print(prompt[:1000] + "..." if len(prompt) > 1000 else prompt)
    print("="*80 + "\n")
    
    for attempt in range(max_retries):
        try:
            client = _get_gemini_client()
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[
                    {
                        "role": "user",
                        "parts": [
                            {
                                "text": f"You are a precise IPO analyst. Respond with valid JSON only, no markdown formatting.\n\n{prompt}"
                            }
                        ]
                    }
                ],
                config={
                    "temperature": 1,
                    "max_output_tokens": 8192,
                    "top_p": 1,
                }
            )
            
            content = response.text.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            elif content.startswith("```"):
                content = content[3:]  # Remove ```
            
            if content.endswith("```"):
                content = content[:-3]  # Remove trailing ```
            
            content = content.strip()

            try:
                return json.loads(content)
            except Exception as e:
                raise LLMError(f"Failed to parse JSON from Gemini: {e}\nRaw: {content}")
                
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = retry_delay * (attempt + 1)
                print(f"Gemini API error (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise LLMError(f"Gemini error after {max_retries} attempts: {e}")


def call_groq_llm(prompt: str) -> Dict[str, Any]:
    """
    Call Groq chat completion API and expect JSON output.
    """
    client = _get_groq_client()

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a precise IPO analyst."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            stream=False,
            timeout=30.0,
        )
    except Exception as e:
        raise LLMError(f"Groq error: {e}")

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except Exception as e:
        raise LLMError(f"Failed to parse JSON from Groq: {e}\nRaw: {content}")


def call_llm(prompt: str) -> Dict[str, Any]:
    """
    Dispatcher for LLM provider.
    """
    if settings.LLM_PROVIDER == "gemini":
        return call_gemini_llm(prompt)
    elif settings.LLM_PROVIDER == "groq":
        return call_groq_llm(prompt)
    else:
        raise LLMError(f"Unsupported LLM provider: {settings.LLM_PROVIDER}")