import uuid

import torch
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config import VOICES_DIR, TEMP_DIR
from models import TTSRequest
from services.tts_service import tts_service

router = APIRouter()


@router.post("/generate")
async def generate_speech(request: TTSRequest):
    emb_path = VOICES_DIR / f"{request.voice_id}.pt"
    if not emb_path.exists():
        raise HTTPException(status_code=404, detail="Voice not found")

    speaker_emb = torch.load(str(emb_path), map_location="cpu")

    audio, _ = await tts_service.generate(
        text=request.text,
        speaker_emb=speaker_emb,
        temperature=request.temperature,
        top_p=request.top_p,
        repetition_penalty=request.repetition_penalty,
    )

    filename = f"{uuid.uuid4()}.wav"
    output_path = TEMP_DIR / filename
    tts_service.save_audio(audio, str(output_path))

    return FileResponse(
        path=str(output_path),
        media_type="audio/wav",
        filename="ttsvibes_output.wav",
        headers={"Content-Disposition": "inline"},
    )
