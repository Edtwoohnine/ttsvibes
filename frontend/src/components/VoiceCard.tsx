import { useState } from "react";
import type { VoiceProfile } from "../types";

interface Props {
  voice: VoiceProfile;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

export function VoiceCard({
  voice,
  isSelected,
  onSelect,
  onDelete,
  onRename,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(voice.name);

  const handleRename = () => {
    if (editName.trim() && editName !== voice.name) {
      onRename(editName.trim());
    }
    setEditing(false);
  };

  return (
    <div
      className={`voice-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="voice-card-info">
        {editing ? (
          <input
            className="input input-sm"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="voice-name">{voice.name}</span>
        )}
        <span className="voice-date">
          {new Date(voice.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="voice-card-actions">
        <button
          className="btn-icon"
          title="Rename"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          &#9998;
        </button>
        <button
          className="btn-icon btn-danger"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this voice profile?")) onDelete();
          }}
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}
