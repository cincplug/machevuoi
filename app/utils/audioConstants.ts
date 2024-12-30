const A4 = 440;
const NOTES: Array<keyof typeof SEMITONES_FROM_A4> = [
  "C",
  // 'C#',
  "D",
  // 'D#',
  // 'E',
  "F",
  // 'F#',
  "G",
  // 'G#',
  "A"
  // 'A#',
  // 'B',
];

const OCTAVE_START = 2;
const OCTAVE_END = 6;
const SEMITONES_FROM_A4 = {
  C: -9,
  "C#": -8,
  D: -7,
  "D#": -6,
  E: -5,
  F: -4,
  "F#": -3,
  G: -2,
  "G#": -1,
  A: 0,
  "A#": 1,
  B: 2
};

export const PIANO_KEYS: {
  note: string;
  path: string;
  fill: "white" | "black";
}[] = [
  {
    note: "C",
    path: "M 0 0 L 25.443 0 L 25.443 164.641 L 47.178 164.641 L 47.178 257.885 L 0 257.885 Z",
    fill: "white"
  },
  {
    note: "C#",
    path: "M 25.443 0 L 59.035 0 L 59.035 164.641 L 25.443 164.641 Z",
    fill: "black"
  },
  {
    note: "D",
    path: "M 94.356 257.885 L 47.178 257.885 L 47.178 164.641 L 59.035 164.641 L 59.035 0 L 82.56 0 L 82.56 164.641 L 94.356 164.641 Z",
    fill: "white"
  },
  {
    note: "D#",
    path: "M 82.56 0 L 116.152 0 L 116.152 164.641 L 82.56 164.641 Z",
    fill: "black"
  },
  {
    note: "E",
    path: "M 141.534 0 L 141.534 257.885 L 94.356 257.885 L 94.356 164.641 L 116.152 164.641 L 116.152 0 Z",
    fill: "white"
  },
  {
    note: "F",
    path: "M 141.534 0 L 166.916 0 L 166.916 164.641 L 188.712 164.641 L 188.712 257.885 L 141.534 257.885 Z",
    fill: "white"
  },
  {
    note: "F#",
    path: "M 166.916 0 L 199.508 0 L 199.508 164.641 L 166.916 164.641 Z",
    fill: "black"
  },
  {
    note: "G",
    path: "M 235.89 257.885 L 188.712 257.885 L 188.712 164.641 L 197.464 164.641 L 197.464 0 L 219.094 0 L 219.094 164.641 L 235.89 164.641 Z",
    fill: "white"
  },
  {
    note: "G#",
    path: "M 219.094 0 L 252.686 0 L 252.686 164.641 L 219.094 164.641 Z",
    fill: "black"
  },
  {
    note: "A",
    path: "M 283.068 257.885 L 235.89 257.885 L 235.89 164.641 L 252.686 164.641 L 252.686 0 L 271.272 0 L 271.272 164.641 L 283.068 164.641 Z",
    fill: "white"
  },
  {
    note: "A#",
    path: "M 304.864 0 L 304.864 164.641 L 271.272 164.641 L 271.272 0 Z",
    fill: "black"
  },
  {
    note: "B",
    path: "M 330.246 0 L 330.246 257.885 L 283.068 257.885 L 283.068 164.641 L 304.864 164.641 L 304.864 0 Z",
    fill: "white"
  }
];

export function getFrequenciesForSelectedNotes(
  selectedNotes: string[]
): number[] {
  return selectedNotes.map((note) =>
    getFrequencyForNote(note as keyof typeof SEMITONES_FROM_A4, 4)
  );
}

export function getPlayableNotes(): Array<keyof typeof SEMITONES_FROM_A4> {
  return NOTES.filter((note) => note !== undefined);
}

export function getFrequencyForNote(
  note: keyof typeof SEMITONES_FROM_A4,
  octave: number
): number {
  const semitones = SEMITONES_FROM_A4[note];
  const octaveOffset = octave - 4;
  return A4 * Math.pow(2, octaveOffset + semitones / 12);
}

export function snapToNearestZone(x: number, width: number): number {
  const totalNotes = NOTES.length * (OCTAVE_END - OCTAVE_START + 1);
  const zoneWidth = width / totalNotes;
  const zoneIndex = Math.floor(x / zoneWidth);

  const octave = OCTAVE_START + Math.floor(zoneIndex / NOTES.length);
  const noteIndex = zoneIndex % NOTES.length;

  return getFrequencyForNote(NOTES[noteIndex], octave);
}
