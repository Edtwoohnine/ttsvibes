interface Props {
  audioUrl: string | null;
}

export function AudioPlayer({ audioUrl }: Props) {
  if (!audioUrl) return null;

  return (
    <div className="audio-player">
      <h3>Generated Audio</h3>
      <audio src={audioUrl} controls className="audio-output" />
      <a href={audioUrl} download="ttsvibes_output.wav" className="btn btn-secondary">
        Download WAV
      </a>
    </div>
  );
}
