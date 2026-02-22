import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

import torch
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from config import VOICES_DIR, TEMP_DIR
from models import VoiceProfile, RenameRequest
from services.embedder_service import embedder_service
from utils.audio import convert_to_wav

router = APIRouter()


@router.post("/upload", response_model=VoiceProfile)
async def upload_voice(
    audio: UploadFile = File(...),
    name: str = Form(...),
):
    voice_id = str(uuid.uuid4())

    # Save uploaded file to temp
    suffix = Path(audio.filename).suffix if audio.filename else ".webm"
    temp_path = TEMP_DIR / f"{voice_id}_upload{suffix}"
    content = await audio.read()
    with open(temp_path, "wb") as f:
        f.write(content)

    try:
        # Convert to WAV
        wav_path = convert_to_wav(temp_path)

        # Create speaker embedding
        speaker_emb = await embedder_service.create_embedding(str(wav_path))

        # Save embedding
        emb_path = VOICES_DIR / f"{voice_id}.pt"
        torch.save(speaker_emb, str(emb_path))

        # Save metadata
        meta = {
            "id": voice_id,
            "name": name,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        meta_path = VOICES_DIR / f"{voice_id}.json"
        with open(meta_path, "w") as f:
            json.dump(meta, f)

        return VoiceProfile(**meta)
    finally:
        # Cleanup temp files
        temp_path.unlink(missing_ok=True)
        wav_path = temp_path.with_suffix(".wav")
        if wav_path.exists():
            wav_path.unlink(missing_ok=True)


@router.get("", response_model=list[VoiceProfile])
async def list_voices():
    voices = []
    for meta_file in sorted(VOICES_DIR.glob("*.json")):
        with open(meta_file) as f:
            voices.append(VoiceProfile(**json.load(f)))
    return voices


@router.delete("/{voice_id}")
async def delete_voice(voice_id: str):
    meta_path = VOICES_DIR / f"{voice_id}.json"
    emb_path = VOICES_DIR / f"{voice_id}.pt"

    if not meta_path.exists():
        raise HTTPException(status_code=404, detail="Voice not found")

    meta_path.unlink(missing_ok=True)
    emb_path.unlink(missing_ok=True)
    return {"status": "deleted"}


@router.patch("/{voice_id}", response_model=VoiceProfile)
async def rename_voice(voice_id: str, body: RenameRequest):
    meta_path = VOICES_DIR / f"{voice_id}.json"

    if not meta_path.exists():
        raise HTTPException(status_code=404, detail="Voice not found")

    with open(meta_path) as f:
        meta = json.load(f)

    meta["name"] = body.name
    with open(meta_path, "w") as f:
        json.dump(meta, f)

    return VoiceProfile(**meta)
