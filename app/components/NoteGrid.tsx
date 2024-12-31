interface NoteGridProps {
  width: number;
  height: number;
  selectedNotes: string[];
  octaveStart: number;
  octaveEnd: number;
}

const NoteGrid: React.FC<NoteGridProps> = ({
  width,
  height,
  selectedNotes,
  octaveStart,
  octaveEnd
}) => {
  const totalOctaves = octaveEnd - octaveStart + 1;
  const totalBars = selectedNotes.length * totalOctaves;
  const barWidth = width / totalBars;

  return (
    <div className="note-grid" style={{ width, height }}>
      {Array.from({ length: totalBars }, (_, i) => {
        const noteIndex = i % selectedNotes.length;
        const octave = Math.floor(i / selectedNotes.length) + octaveStart;
        return (
          <div key={i} className="grid-bar" style={{ width: barWidth }}>
            <div className="note-label">
              {`${selectedNotes[noteIndex]}${octave}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteGrid;
