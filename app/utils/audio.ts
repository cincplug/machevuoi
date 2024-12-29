import { snapToNearestZone } from "./audioConstants";

interface OscillatorSetup {
  hasToneSnap: boolean;
  hasSound: boolean;
}

export class OscillatorManager {
  private audioContext: AudioContext;
  private oscillators: Map<number, {
    osc: OscillatorNode;
    gain: GainNode;
  }>;
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
    if (width <= 0 || height <= 0) return;

    const boundedX = Math.max(0, Math.min(x, width));
    const boundedY = Math.max(0, Math.min(y, height));
    
    let oscillator = this.oscillators.get(index);
    
    if (!this.setup.hasSound) {
      if (oscillator) {
        oscillator.gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      }
      return;
    }

    if (!oscillator) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      oscillator = { osc, gain };
      this.oscillators.set(index, oscillator);
    }

    try {
      const freq = this.setup.hasToneSnap 
        ? snapToNearestZone(boundedX, width)
        : Math.min(2000, Math.max(20, (boundedX / width) * 1900 + 100));

      oscillator.osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      
      const vol = Math.max(0, Math.min(1, 1 - (boundedY / height)));
      oscillator.gain.gain.setValueAtTime(vol * 0.1, this.audioContext.currentTime);
    } catch (error) {
      console.error('Audio parameter error:', error);
      oscillator.gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
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