from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
VOICES_DIR = DATA_DIR / "voices"
TEMP_DIR = BASE_DIR / "temp"

# Ensure directories exist
VOICES_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Model config
TTS_MODEL_NAME = "nineninesix/kani-tts-2-en"
EMBEDDER_MODEL_NAME = "nineninesix/speaker-emb-tbr"

# Generation defaults
DEFAULT_TEMPERATURE = 0.8
DEFAULT_TOP_P = 0.92
DEFAULT_REPETITION_PENALTY = 1.15

# Cleanup
TEMP_MAX_AGE_SECONDS = 3600  # 1 hour
