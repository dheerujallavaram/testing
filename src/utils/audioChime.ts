/**
 * Pure Web Audio API synthesis for temple bell chime and sacred Om drone
 * 100% self-contained, no external mp3 files required!
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a rich, resonant temple brass bell chime
 */
export function playTempleBell(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 587.33; // D5 tone (traditional Indian temple bell)

    // Harmonics of temple bell
    const harmonics = [
      { freq: fundamental * 1.0, gain: 0.4, decay: 3.2 },
      { freq: fundamental * 2.02, gain: 0.25, decay: 2.4 },
      { freq: fundamental * 3.01, gain: 0.18, decay: 1.8 },
      { freq: fundamental * 4.25, gain: 0.1, decay: 1.2 },
      { freq: fundamental * 5.4, gain: 0.05, decay: 0.8 },
    ];

    harmonics.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (e) {
    console.warn('Audio playback not supported or user interaction needed', e);
  }
}

/**
 * Plays a sacred Om resonance tone (136.1 Hz - Cosmic Octave Om)
 */
export function playSacredOm(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 136.1;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2, now); // Octave

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.5);
    osc2.stop(now + 4.5);
  } catch (e) {
    console.warn('Audio playback not supported', e);
  }
}
