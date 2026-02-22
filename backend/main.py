import asyncio
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import TEMP_DIR, TEMP_MAX_AGE_SECONDS, TTS_MODEL_NAME, EMBEDDER_MODEL_NAME
from services.tts_service import tts_service
from services.embedder_service import embedder_service
from routers import voices, tts


async def cleanup_temp_files():
    """Delete generated audio files older than TEMP_MAX_AGE_SECONDS."""
    while True:
        cutoff = datetime.now().timestamp() - TEMP_MAX_AGE_SECONDS
        for f in TEMP_DIR.glob("*.wav"):
            try:
                if f.stat().st_mtime < cutoff:
                    f.unlink(missing_ok=True)
            except OSError:
                pass
        await asyncio.sleep(600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load models
    print("Loading TTS model...")
    tts_service.load(TTS_MODEL_NAME)
    print("Loading speaker embedder...")
    embedder_service.load(EMBEDDER_MODEL_NAME)
    print("Models loaded. Ready to serve.")

    cleanup_task = asyncio.create_task(cleanup_temp_files())
    yield

    # Shutdown
    cleanup_task.cancel()


app = FastAPI(title="TTSVibes", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voices.router, prefix="/api/voices", tags=["voices"])
app.include_router(tts.router, prefix="/api/tts", tags=["tts"])


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "tts_loaded": tts_service.model is not None,
        "embedder_loaded": embedder_service.embedder is not None,
    }
