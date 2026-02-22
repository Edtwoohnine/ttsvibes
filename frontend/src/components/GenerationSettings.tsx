import type { GenerationSettings as Settings } from "../types";

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function GenerationSettings({ settings, onChange }: Props) {
  const update = (key: keyof Settings, value: number) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="generation-settings">
      <h3>Settings</h3>

      <label className="setting-row">
        <span>Temperature: {settings.temperature.toFixed(2)}</span>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.05"
          value={settings.temperature}
          onChange={(e) => update("temperature", parseFloat(e.target.value))}
        />
      </label>

      <label className="setting-row">
        <span>Top P: {settings.top_p.toFixed(2)}</span>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.01"
          value={settings.top_p}
          onChange={(e) => update("top_p", parseFloat(e.target.value))}
        />
      </label>

      <label className="setting-row">
        <span>Repetition Penalty: {settings.repetition_penalty.toFixed(2)}</span>
        <input
          type="range"
          min="1.0"
          max="2.0"
          step="0.05"
          value={settings.repetition_penalty}
          onChange={(e) =>
            update("repetition_penalty", parseFloat(e.target.value))
          }
        />
      </label>
    </div>
  );
}
