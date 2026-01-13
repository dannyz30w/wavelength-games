import { useCallback, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type SoundType = "click" | "success" | "reveal" | "submit" | "join" | "error" | "whoosh" | "pop" | "ding" | "sweep" | "magic" | "powerup" | "sparkle" | "bounce" | "fanfare" | "swoosh" | "chime" | "bubble" | "wind" | "crackle" | "chime_ice" | "twinkle";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { currentTheme } = useTheme();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number, 
    duration: number, 
    type: OscillatorType = "sine", 
    volume: number = 0.3,
    fadeOut: boolean = true,
    delay: number = 0
  ) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      if (fadeOut) {
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      }
      
      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }, [getAudioContext]);

  const playNoise = useCallback((duration: number, volume: number = 0.1, filterFreq: number = 2000, delay: number = 0) => {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      filter.type = "lowpass";
      filter.frequency.value = filterFreq;
      
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      
      source.start(ctx.currentTime + delay);
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext]);

  const playFrequencySweep = useCallback((startFreq: number, endFreq: number, duration: number, volume: number = 0.15, type: OscillatorType = "sine", delay: number = 0) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + delay + duration);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      
      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext]);

  const playChord = useCallback((frequencies: number[], duration: number, volume: number = 0.08, delay: number = 0) => {
    frequencies.forEach((freq, i) => {
      playTone(freq, duration, "sine", volume, true, delay + i * 0.015);
    });
  }, [playTone]);

  const playArpeggio = useCallback((frequencies: number[], noteDuration: number, gap: number, volume: number = 0.1) => {
    frequencies.forEach((freq, i) => {
      playTone(freq, noteDuration, "sine", volume, true, i * gap);
    });
  }, [playTone]);

  // Theme-specific sound modifiers
  const getThemeSoundModifier = useCallback(() => {
    const profile = currentTheme.soundProfile;
    switch (profile) {
      case "ocean":
        return { baseFreq: 0.8, reverb: 1.2, bubbles: true };
      case "space":
        return { baseFreq: 1.2, reverb: 1.5, echo: true };
      case "desert":
        return { baseFreq: 0.9, reverb: 0.8, warm: true };
      case "forest":
        return { baseFreq: 1.0, reverb: 1.1, nature: true };
      case "neon":
        return { baseFreq: 1.3, reverb: 0.9, synth: true };
      case "warm":
        return { baseFreq: 0.85, reverb: 1.0, warm: true };
      case "ice":
        return { baseFreq: 1.4, reverb: 1.3, crystal: true };
      case "fire":
        return { baseFreq: 0.75, reverb: 0.7, crackle: true };
      case "sweet":
        return { baseFreq: 1.15, reverb: 1.1, playful: true };
      case "ethereal":
        return { baseFreq: 1.1, reverb: 1.4, mystic: true };
      default:
        return { baseFreq: 1.0, reverb: 1.0 };
    }
  }, [currentTheme.soundProfile]);

  const playSound = useCallback((sound: SoundType) => {
    const mod = getThemeSoundModifier();
    const freqMod = mod.baseFreq;

    switch (sound) {
      case "click":
        playTone(2200 * freqMod, 0.025, "sine", 0.08);
        playTone(1800 * freqMod, 0.02, "sine", 0.04, true, 0.01);
        break;
        
      case "pop":
        playTone(500 * freqMod, 0.05, "sine", 0.2);
        playTone(1000 * freqMod, 0.04, "sine", 0.15, true, 0.015);
        playTone(700 * freqMod, 0.03, "sine", 0.08, true, 0.04);
        if (mod.bubbles) {
          playNoise(0.05, 0.04, 4000, 0.02);
        } else {
          playNoise(0.03, 0.03, 6000, 0.02);
        }
        break;
        
      case "success":
        playChord([523 * freqMod, 659 * freqMod], 0.12);
        playChord([659 * freqMod, 784 * freqMod], 0.12, 0.08, 0.1);
        playChord([784 * freqMod, 988 * freqMod], 0.15, 0.08, 0.2);
        playChord([1047 * freqMod, 1319 * freqMod, 1568 * freqMod], 0.4, 0.1, 0.35);
        playFrequencySweep(800 * freqMod, 1600 * freqMod, 0.3, 0.05, "sine", 0.35);
        break;
        
      case "reveal":
        if (mod.bubbles) {
          // Ocean reveal with bubble sounds
          playNoise(0.3, 0.06, 3000);
          playFrequencySweep(100 * freqMod, 300 * freqMod, 0.4, 0.08, "triangle");
        } else if (mod.crystal) {
          // Ice reveal with crystalline sounds
          playArpeggio([800, 1200, 1600, 2000, 2400].map(f => f * freqMod), 0.08, 0.05, 0.06);
        } else if (mod.crackle) {
          // Fire reveal with crackling
          playNoise(0.25, 0.08, 2000);
          playFrequencySweep(80 * freqMod, 400 * freqMod, 0.4, 0.1, "sawtooth");
        } else {
          playNoise(0.2, 0.05, 4000);
          playFrequencySweep(120 * freqMod, 350 * freqMod, 0.35, 0.1, "triangle");
        }
        playArpeggio([330, 392, 494, 587, 659].map(f => f * freqMod), 0.12, 0.08, 0.08);
        playChord([523, 659, 784, 1047].map(f => f * freqMod), 0.45, 0.08, 0.4);
        break;
        
      case "submit":
        playTone(880 * freqMod, 0.04, "sine", 0.12);
        playTone(1100 * freqMod, 0.06, "sine", 0.15, true, 0.03);
        playTone(1320 * freqMod, 0.08, "sine", 0.1, true, 0.07);
        playNoise(0.02, 0.02, 5000, 0.04);
        break;
        
      case "join":
        playArpeggio([440, 554, 659, 880].map(f => f * freqMod), 0.1, 0.07, 0.12);
        playTone(1047 * freqMod, 0.2, "sine", 0.08, true, 0.3);
        break;
        
      case "error":
        playTone(280 * freqMod, 0.1, "triangle", 0.1);
        playTone(220 * freqMod, 0.15, "triangle", 0.08, true, 0.08);
        break;
        
      case "whoosh":
        if (mod.bubbles) {
          // Underwater whoosh
          playNoise(0.25, 0.06, 2500);
          playFrequencySweep(400 * freqMod, 60 * freqMod, 0.2, 0.05);
        } else {
          playNoise(0.2, 0.08, 3500);
          playFrequencySweep(600 * freqMod, 80 * freqMod, 0.18, 0.06);
        }
        playFrequencySweep(400 * freqMod, 100 * freqMod, 0.12, 0.03, "triangle", 0.05);
        break;
        
      case "ding":
        const dingBase = mod.crystal ? 1.3 : 1;
        playTone(1047 * freqMod * dingBase, 0.15, "sine", 0.18);
        playTone(1319 * freqMod * dingBase, 0.12, "sine", 0.12, true, 0.02);
        playTone(1568 * freqMod * dingBase, 0.2, "sine", 0.08, true, 0.05);
        playTone(2093 * freqMod * dingBase, 0.1, "sine", 0.04, true, 0.08);
        break;
        
      case "sweep":
        playFrequencySweep(180 * freqMod, 700 * freqMod, 0.18, 0.08);
        playFrequencySweep(350 * freqMod, 900 * freqMod, 0.12, 0.05, "triangle", 0.06);
        break;

      case "magic":
        for (let i = 0; i < 6; i++) {
          const freq = (1000 + Math.random() * 800) * freqMod;
          playTone(freq, 0.1, "sine", 0.05, true, i * 0.04);
        }
        playFrequencySweep(300 * freqMod, 900 * freqMod, 0.35, 0.06, "triangle");
        playChord([659, 784, 988].map(f => f * freqMod), 0.25, 0.04, 0.15);
        break;

      case "powerup":
        playFrequencySweep(150 * freqMod, 700 * freqMod, 0.3, 0.12, "sawtooth");
        playFrequencySweep(200 * freqMod, 900 * freqMod, 0.25, 0.08, "triangle", 0.05);
        playChord([523, 659, 784, 1047].map(f => f * freqMod), 0.35, 0.08, 0.18);
        playTone(1319 * freqMod, 0.2, "sine", 0.06, true, 0.3);
        break;

      case "sparkle":
        const sparkleNotes = [1400, 1700, 2000, 1600, 1900, 1500, 1800].map(f => f * freqMod);
        sparkleNotes.forEach((freq, i) => {
          playTone(freq, 0.06, "sine", 0.05 - i * 0.005, true, i * 0.035);
        });
        break;

      case "bounce":
        playTone(280 * freqMod, 0.06, "sine", 0.14);
        playTone(420 * freqMod, 0.05, "sine", 0.12, true, 0.05);
        playTone(560 * freqMod, 0.06, "sine", 0.1, true, 0.1);
        playTone(700 * freqMod, 0.08, "sine", 0.08, true, 0.15);
        break;

      case "fanfare":
        playChord([392, 494].map(f => f * freqMod), 0.15, 0.1);
        playChord([494, 587].map(f => f * freqMod), 0.15, 0.1, 0.12);
        playChord([587, 698].map(f => f * freqMod), 0.15, 0.1, 0.24);
        playChord([784, 988, 1175].map(f => f * freqMod), 0.5, 0.12, 0.4);
        playFrequencySweep(600 * freqMod, 1400 * freqMod, 0.35, 0.06, "sine", 0.4);
        break;

      case "swoosh":
        playNoise(0.12, 0.06, 4000);
        playFrequencySweep(800 * freqMod, 200 * freqMod, 0.1, 0.04);
        break;

      case "chime":
        playTone(880 * freqMod, 0.12, "sine", 0.1);
        playTone(1108 * freqMod, 0.12, "sine", 0.08, true, 0.04);
        playTone(1320 * freqMod, 0.15, "sine", 0.06, true, 0.08);
        break;

      case "bubble":
        // Underwater bubble sound
        for (let i = 0; i < 4; i++) {
          playTone((300 + Math.random() * 200) * freqMod, 0.08, "sine", 0.06, true, i * 0.05);
        }
        playNoise(0.08, 0.03, 3000, 0.1);
        break;

      case "wind":
        // Desert wind sound
        playNoise(0.5, 0.04, 1500);
        playFrequencySweep(100, 80, 0.5, 0.02, "sine");
        break;

      case "crackle":
        // Fire crackle
        for (let i = 0; i < 5; i++) {
          playNoise(0.03, 0.05, 8000, i * 0.04);
        }
        break;

      case "chime_ice":
        // Ice crystal chime
        const iceFreqs = [2000, 2400, 2800, 3200].map(f => f * freqMod);
        iceFreqs.forEach((freq, i) => {
          playTone(freq, 0.15, "sine", 0.04, true, i * 0.03);
        });
        break;

      case "twinkle":
        // Ethereal twinkle
        for (let i = 0; i < 8; i++) {
          const freq = (1500 + Math.random() * 1000) * freqMod;
          playTone(freq, 0.08, "sine", 0.03, true, i * 0.06);
        }
        break;
    }
  }, [playTone, playNoise, playFrequencySweep, playChord, playArpeggio, getThemeSoundModifier]);

  return { playSound };
};
