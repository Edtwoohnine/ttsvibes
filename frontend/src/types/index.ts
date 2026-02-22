export interface VoiceProfile {
  id: string;
  name: string;
  created_at: string;
}

export interface GenerationSettings {
  temperature: number;
  top_p: number;
  repetition_penalty: number;
}

export interface TTSRequest {
  voice_id: string;
  text: string;
  temperature: number;
  top_p: number;
  repetition_penalty: number;
}
