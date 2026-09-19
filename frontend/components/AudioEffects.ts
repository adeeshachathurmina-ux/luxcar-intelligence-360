"use client";

/**
 * World-Class High-End Automotive Web Audio Synthesizer (100% Zero External MP3 Dependencies!)
 * Synthesizes dynamic realistic sports car throttle revs, turbo flutter, supersonic near-misses,
 * luxury UI chimes, and an optional retro synthwave highway groove using browser Web Audio API.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private synthwavePlaying: boolean = false;
  private synthwaveTimer: any = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** Soft luxury glass tactile click */
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  /** Futuristic luxury mode switch chime */
  playChime() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.045);

        gain.gain.setValueAtTime(0.05, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.28);
      });
    } catch (e) {}
  }

  /** Satisfying sports throttle / rev with twin turbo rumble */
  playEngineRev() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(175, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.7);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110, now);
      osc2.frequency.exponentialRampToValueAtTime(350, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(160, now + 0.7);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(950, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.7);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.75);
      osc2.stop(now + 0.75);

      // Add turbo flutter at the tail of the rev
      setTimeout(() => this.playTurboBlowoff(0.06), 320);
    } catch (e) {}
  }

  /** High-performance Turbo Blow-off valve flutter (Pshhh-tututu!) */
  playTurboBlowoff(volume: number = 0.1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer for high-pressure air hiss
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(3200, now);
      bandpass.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      bandpass.Q.setValueAtTime(4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch (e) {}
  }

  /** Doppler near-miss whoosh when overtaking at high speed */
  playNearMiss() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  /** Tire squeal for drift and hard braking */
  playTireScreech() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  /** Collect coin / cash chime */
  playCoin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [987.77, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.18);
      });
    } catch (e) {}
  }

  /** Crash explosion rumble */
  playCrash() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(200, now);
      lowpass.frequency.exponentialRampToValueAtTime(50, now + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.5);
    } catch (e) {}
  }

  /** Futuristic Electric Motor Whine */
  playElectricWhine() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.5);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  /** Ambient highway night drive background hum (subtle relaxation) */
  toggleAmbientHighway(enable: boolean) {
    if (!enable) {
      if (this.ambientOsc) {
        try {
          this.ambientOsc.stop();
          this.ambientOsc.disconnect();
        } catch (e) {}
        this.ambientOsc = null;
      }
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      if (this.ambientOsc) return;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(48, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch (e) {}
  }

  /** Procedural 80s Synthwave Highway Beat for Arcade Mode */
  toggleSynthwaveBeat(enable: boolean) {
    this.synthwavePlaying = enable;
    if (!enable) {
      if (this.synthwaveTimer) {
        clearInterval(this.synthwaveTimer);
        this.synthwaveTimer = null;
      }
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;

    const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 98, 123.47];
    let noteIdx = 0;

    this.synthwaveTimer = setInterval(() => {
      if (!this.synthwavePlaying || !this.enabled) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(bassNotes[noteIdx % bassNotes.length], now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
        noteIdx++;
      } catch (e) {}
    }, 180);
  }
}

export const soundFX = new SoundController();
