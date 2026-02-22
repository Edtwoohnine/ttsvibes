import asyncio
from pathlib import Path

import torch


class EmbedderService:
    def __init__(self):
        self.embedder = None
        self._lock = asyncio.Lock()

    def load(self, model_name: str, device: str = "cuda"):
        from kani_tts import SpeakerEmbedder
        self.embedder = SpeakerEmbedder(
            model_name=model_name,
            device=device,
            max_duration_sec=30.0,
        )

    async def create_embedding(self, audio_path: str) -> torch.Tensor:
        async with self._lock:
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(
                None,
                lambda: self.embedder.embed_audio_file(audio_path),
            )
            return embedding


embedder_service = EmbedderService()
