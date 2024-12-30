import {
  snapToNearestZone,
  getFrequenciesForSelectedNotes
} from "./audioConstants";

interface OscillatorSetup {
  hasToneSnap: boolean;
  hasSound: boolean;
  selectedNotes: string[];
}

export class OscillatorManager {
  private audioContext: AudioContext;
  private oscillators: Map<
    number,
    {
      osc: OscillatorNode;
      gain: GainNode;
    }
  >;
  private setup: OscillatorSetup;

  constructor(setup: OscillatorSetup) {
    this.audioContext = new AudioContext();
    this.oscillators = new Map();
    this.setup = setup;
  }

  updateSetup(newSetup: OscillatorSetup) {
    this.setup = newSetup;

    if (!newSetup.hasSound) {
      this.oscillators.forEach(({ gain }) => {
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      });
    }
  }

  updateOscillator(
    index: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (!this.setup.hasSound) return;

    const boundedX = Math.max(0, Math.min(x, width));
    const boundedY = Math.max(0, Math.min(y, height));

    const availableFrequencies = getFrequenciesForSelectedNotes(
      this.setup.selectedNotes
    );
    if (availableFrequencies.length === 0) return;

    const freqIndex = Math.floor(
      (boundedX / width) * availableFrequencies.length
    );
    const freq = availableFrequencies[freqIndex] || availableFrequencies[0];

    let oscillator = this.oscillators.get(index);
    if (!oscillator) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      oscillator = { osc, gain };
      this.oscillators.set(index, oscillator);
    }

    oscillator.osc.frequency.setValueAtTime(
      freq,
      this.audioContext.currentTime
    );
    const vol = Math.max(0, 1 - boundedY / height);
    oscillator.gain.gain.setValueAtTime(
      vol * 0.1,
      this.audioContext.currentTime
    );
  }

  cleanup() {
    this.oscillators.forEach(({ osc, gain }) => {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    });
    this.oscillators.clear();
  }

  cleanupUnusedOscillators(activeCount: number) {
    for (let i = activeCount; i < this.oscillators.size; i++) {
      const osc = this.oscillators.get(i);
      if (osc) {
        osc.gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.oscillators.delete(i);
      }
    }
  }
}
