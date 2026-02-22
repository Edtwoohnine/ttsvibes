from pathlib import Path

import librosa
import soundfile as sf


def convert_to_wav(input_path: Path) -> Path:
    """Convert any supported audio format to 16kHz mono WAV."""
    audio, _ = librosa.load(str(input_path), sr=16000, mono=True)
    wav_path = input_path.with_suffix(".wav")
    sf.write(str(wav_path), audio, 16000)
    return wav_path
