import type { VoiceProfile } from "../types";
import { VoiceCard } from "./VoiceCard";

interface Props {
  voices: VoiceProfile[];
  selectedVoiceId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function VoiceList({
  voices,
  selectedVoiceId,
  onSelect,
  onDelete,
  onRename,
}: Props) {
  if (voices.length === 0) {
    return <p className="empty-state">No voice profiles yet. Record or upload one above.</p>;
  }

  return (
    <div className="voice-list">
      <h3>Your Voices</h3>
      {voices.map((v) => (
        <VoiceCard
          key={v.id}
          voice={v}
          isSelected={v.id === selectedVoiceId}
          onSelect={() => onSelect(v.id)}
          onDelete={() => onDelete(v.id)}
          onRename={(name) => onRename(v.id, name)}
        />
      ))}
    </div>
  );
}
