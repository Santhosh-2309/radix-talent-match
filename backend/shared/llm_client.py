import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class GroqLLMClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.client = OpenAI(
            api_key=self.api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        self.model = "llama-3.3-70b-versatile"

    def call_llm(self, system_prompt: str, user_prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"LLM Error: {e}")
            raise e

llm_client = GroqLLMClient()
