import { useState, useCallback } from "react";
import { Layout } from "./components/Layout";
import { VoiceRecorder } from "./components/VoiceRecorder";
import { VoiceList } from "./components/VoiceList";
import { TextInput } from "./components/TextInput";
import { GenerationSettings } from "./components/GenerationSettings";
import { AudioPlayer } from "./components/AudioPlayer";
import { useVoices } from "./hooks/useVoices";
import { generateSpeech } from "./api/tts";
import type { GenerationSettings as Settings } from "./types";

function App() {
  const {
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    upload,
    remove,
    rename,
  } = useVoices();

  const [text, setText] = useState("");
  const [settings, setSettings] = useState<Settings>({
    temperature: 0.8,
    top_p: 0.92,
    repetition_penalty: 1.15,
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selectedVoiceId || !text.trim()) return;
    setGenerating(true);
    setError(null);

    try {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = await generateSpeech(selectedVoiceId, text, settings);
      setAudioUrl(url);
    } catch {
      setError("Failed to generate speech. Check the backend is running.");
    } finally {
      setGenerating(false);
    }
  }, [selectedVoiceId, text, settings, audioUrl]);

  return (
    <Layout
      sidebar={
        <>
          <VoiceRecorder
            onUpload={async (blob, name) => {
              await upload(blob, name);
            }}
          />
          <VoiceList
            voices={voices}
            selectedVoiceId={selectedVoiceId}
            onSelect={setSelectedVoiceId}
            onDelete={remove}
            onRename={rename}
          />
        </>
      }
      main={
        <>
          {!selectedVoiceId && (
            <p className="empty-state">
              Select or create a voice profile to get started.
            </p>
          )}
          {selectedVoiceId && (
            <>
              <TextInput
                text={text}
                onChange={setText}
                onGenerate={handleGenerate}
                disabled={!selectedVoiceId}
                generating={generating}
              />
              <GenerationSettings
                settings={settings}
                onChange={setSettings}
              />
              {error && <p className="error">{error}</p>}
              <AudioPlayer audioUrl={audioUrl} />
            </>
          )}
        </>
      }
    />
  );
}

export default App;
