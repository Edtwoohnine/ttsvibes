import { useState, useRef } from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface Props {
  onUpload: (blob: Blob, name: string) => Promise<void>;
}

export function VoiceRecorder({ onUpload }: Props) {
  const { isRecording, audioBlob, duration, start, stop, clear } =
    useAudioRecorder();
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clear();
      // Treat the file as the audioBlob by triggering the same flow
      // We'll store it via a ref trick - actually just call onUpload directly
      // But we want the same UX, so we set it as the blob
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: file.type,
        });
        // We need to expose this - let's use a simpler approach
        setFileBlob(blob);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  const activeBlob = audioBlob || fileBlob;

  const handleFullSubmit = async () => {
    if (!activeBlob || !name.trim()) return;
    setUploading(true);
    setError(null);
    try {
      await onUpload(activeBlob, name.trim());
      setName("");
      clear();
      setFileBlob(null);
    } catch {
      setError("Failed to create voice profile. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="voice-recorder">
      <h3>Create Voice Profile</h3>

      <div className="recorder-controls">
        {!isRecording ? (
          <button className="btn btn-record" onClick={start}>
            Record Voice
          </button>
        ) : (
          <button className="btn btn-stop" onClick={stop}>
            Stop ({formatDuration(duration)})
          </button>
        )}

        <span className="divider">or</span>

        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Audio
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          hidden
        />
      </div>

      {activeBlob && (
        <div className="recorder-preview">
          <audio
            src={URL.createObjectURL(activeBlob)}
            controls
            className="audio-preview"
          />
          <input
            type="text"
            placeholder="Voice name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <button
            className="btn btn-primary"
            onClick={handleFullSubmit}
            disabled={uploading || !name.trim()}
          >
            {uploading ? "Creating..." : "Create Voice"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
