import client from "./client";
import type { GenerationSettings } from "../types";

export async function generateSpeech(
  voiceId: string,
  text: string,
  settings: GenerationSettings
): Promise<string> {
  const response = await client.post(
    "/tts/generate",
    {
      voice_id: voiceId,
      text,
      ...settings,
    },
    { responseType: "blob" }
  );

  const blob = new Blob([response.data], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}
