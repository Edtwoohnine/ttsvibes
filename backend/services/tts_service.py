import asyncio
from pathlib import Path

import numpy as np


class TTSService:
    def __init__(self):
        self.model = None
        self._lock = asyncio.Lock()

    def load(self, model_name: str, device_map: str = "auto"):
        from kani_tts import KaniTTS
        self.model = KaniTTS(model_name, device_map=device_map, suppress_logs=True)

    async def generate(
        self,
        text: str,
        speaker_emb,
        temperature: float = 0.8,
        top_p: float = 0.92,
        repetition_penalty: float = 1.15,
    ) -> tuple[np.ndarray, str]:
        async with self._lock:
            loop = asyncio.get_event_loop()
            audio, text_out = await loop.run_in_executor(
                None,
                lambda: self.model(
                    text,
                    speaker_emb=speaker_emb,
                    temperature=temperature,
                    top_p=top_p,
                    repetition_penalty=repetition_penalty,
                ),
            )
            return audio, text_out

    def save_audio(self, audio: np.ndarray, path: str):
        self.model.save_audio(audio, path)


tts_service = TTSService()
