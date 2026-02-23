# TTSVibes

A locally hosted web app for voice cloning and text-to-speech powered by [Kani-TTS-2](https://github.com/nineninesix-ai/kani-tts-2).

Record your voice (or upload audio), create a voice clone, then generate speech from any text using your cloned voice.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **NVIDIA GPU** with CUDA support (~3GB VRAM)
- **ffmpeg** on PATH (for audio format conversion)
  ```bash
  # Windows
  winget install ffmpeg
  ```

## Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/macOS

pip install -r requirements.txt
pip install --no-deps kani-tts-2==0.0.5

uvicorn main:app --reload
```

> **Note (Windows):** `kani-tts-2` is installed with `--no-deps` because its transitive dependency `pynini` does not build on Windows. All core deps (`nemo-toolkit`, `transformers`, etc.) are pinned in `requirements.txt`. The `nemo_text_processing` module (text normalization) is unavailable on Windows but is not needed for voice cloning or TTS generation.

The API server starts at `http://localhost:8000`. Models are downloaded on first launch (may take a few minutes).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend.

## Usage

1. **Create a voice profile** — Record your voice via microphone or upload a WAV/MP3 file. Give it a name and click "Create Voice".
2. **Select a voice** — Click on a voice profile in the sidebar to select it.
3. **Generate speech** — Type your text, adjust generation settings if desired, and click "Generate Speech".
4. **Download** — Play the generated audio in-browser or download the WAV file.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/voices/upload` | Upload audio to create a voice profile |
| GET | `/api/voices` | List all voice profiles |
| DELETE | `/api/voices/{id}` | Delete a voice profile |
| PATCH | `/api/voices/{id}` | Rename a voice profile |
| POST | `/api/tts/generate` | Generate speech from text |
| GET | `/api/health` | Health check |

## Tech Stack

- **Backend**: FastAPI, Kani-TTS-2, PyTorch
- **Frontend**: React, TypeScript, Vite
- **Model**: Kani-TTS-2 (400M params, ~3GB VRAM)
