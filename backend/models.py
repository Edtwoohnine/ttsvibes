from pydantic import BaseModel, Field


class VoiceProfile(BaseModel):
    id: str
    name: str
    created_at: str


class TTSRequest(BaseModel):
    voice_id: str
    text: str
    temperature: float = Field(default=0.8, ge=0.1, le=2.0)
    top_p: float = Field(default=0.92, ge=0.1, le=1.0)
    repetition_penalty: float = Field(default=1.15, ge=1.0, le=2.0)


class RenameRequest(BaseModel):
    name: str
