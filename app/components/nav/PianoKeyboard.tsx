import React from "react";
import { PIANO_KEYS } from "../../utils/audioConstants";

interface PianoKeyboardProps {
  selectedNotes: string[];
  onNotesChange: (notes: string[]) => void;
}

interface PianoKeyProps {
  note: string;
  isSelected: boolean;
  path: string;
  fill: "white" | "black";
  onToggle: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isSelected,
  path,
  fill,
  onToggle
}) => {
  return (
    <path
      className={`tone ${fill} ${isSelected ? "selected" : ""}`}
      d={path}
      onClick={() => onToggle(note)}
    />
  );
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  selectedNotes,
  onNotesChange
}) => {
  const handleToggle = (note: string) => {
    const newSelection = selectedNotes.includes(note)
      ? selectedNotes.filter((n) => n !== note)
      : [...selectedNotes, note];
    onNotesChange(newSelection);
  };

  return (
    <svg className="piano" viewBox="0 0 331 260">
      <g className="octave">
        {PIANO_KEYS.map((keyData, i) => (
          <PianoKey
            key={`${keyData.note}-${i}`}
            note={keyData.note}
            path={keyData.path}
            fill={keyData.fill}
            isSelected={selectedNotes.includes(keyData.note)}
            onToggle={handleToggle}
          />
        ))}
      </g>
    </svg>
  );
};

export default PianoKeyboard;
