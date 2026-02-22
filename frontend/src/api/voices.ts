import client from "./client";
import type { VoiceProfile } from "../types";

export async function uploadVoice(
  audioBlob: Blob,
  name: string
): Promise<VoiceProfile> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("name", name);
  const { data } = await client.post("/voices/upload", formData);
  return data;
}

export async function listVoices(): Promise<VoiceProfile[]> {
  const { data } = await client.get("/voices");
  return data;
}

export async function deleteVoice(id: string): Promise<void> {
  await client.delete(`/voices/${id}`);
}

export async function renameVoice(
  id: string,
  name: string
): Promise<VoiceProfile> {
  const { data } = await client.patch(`/voices/${id}`, { name });
  return data;
}
