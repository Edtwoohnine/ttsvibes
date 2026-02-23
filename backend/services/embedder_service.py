import asyncio
from pathlib import Path

import torch
import torchaudio
import soundfile as sf
import numpy as np


def _soundfile_load(uri, frame_offset=0, num_frames=-1, normalize=True,
                    channels_first=True, format=None, buffer_size=4096,
                    backend=None):
    """Drop-in replacement for torchaudio.load using soundfile (no torchcodec)."""
    data, sample_rate = sf.read(uri, start=frame_offset,
                                stop=None if num_frames == -1 else frame_offset + num_frames,
                                dtype="float32", always_2d=True)
    waveform = torch.from_numpy(data.T if channels_first else data)
    return waveform, sample_rate


# torchaudio 2.10+ requires torchcodec for load(), which needs FFmpeg DLLs.
# Patch it to use soundfile instead.
torchaudio.load = _soundfile_load


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
