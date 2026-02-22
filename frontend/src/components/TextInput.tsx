interface Props {
  text: string;
  onChange: (text: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  generating: boolean;
}

export function TextInput({
  text,
  onChange,
  onGenerate,
  disabled,
  generating,
}: Props) {
  return (
    <div className="text-input">
      <h3>Text to Speak</h3>
      <textarea
        className="textarea"
        rows={6}
        placeholder="Type the text you want to convert to speech..."
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-input-footer">
        <span className="char-count">{text.length} characters</span>
        <button
          className="btn btn-primary btn-lg"
          onClick={onGenerate}
          disabled={disabled || generating || !text.trim()}
        >
          {generating ? "Generating..." : "Generate Speech"}
        </button>
      </div>
    </div>
  );
}
