import { useState, useEffect, useCallback } from "react";
import type { VoiceProfile } from "../types";
import * as voicesApi from "../api/voices";

export function useVoices() {
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voicesApi.listVoices();
      setVoices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (blob: Blob, name: string) => {
      const voice = await voicesApi.uploadVoice(blob, name);
      await refresh();
      setSelectedVoiceId(voice.id);
      return voice;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await voicesApi.deleteVoice(id);
      if (selectedVoiceId === id) setSelectedVoiceId(null);
      await refresh();
    },
    [refresh, selectedVoiceId]
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await voicesApi.renameVoice(id, name);
      await refresh();
    },
    [refresh]
  );

  return {
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    loading,
    upload,
    remove,
    rename,
  };
}
