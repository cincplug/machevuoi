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
