import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "reveal" | "submit" | "join" | "error" | "whoosh" | "pop" | "ding" | "sweep" | "magic" | "powerup" | "sparkle" | "bounce";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

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
    fadeOut: boolean = true
  ) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      if (fadeOut) {
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      }
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }, [getAudioContext]);

  const playNoise = useCallback((duration: number, volume: number = 0.1, filterFreq: number = 2000) => {
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
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      source.start(ctx.currentTime);
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext]);

  const playFrequencySweep = useCallback((startFreq: number, endFreq: number, duration: number, volume: number = 0.15, type: OscillatorType = "sine") => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext]);

  const playChord = useCallback((frequencies: number[], duration: number, volume: number = 0.08) => {
    frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, duration, "sine", volume), i * 20);
    });
  }, [playTone]);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case "click":
        // Crisp click with subtle resonance
        playTone(2000, 0.03, "sine", 0.06);
        setTimeout(() => playTone(1500, 0.02, "sine", 0.03), 15);
        break;
        
      case "pop":
        // Satisfying bubble pop with depth
        playTone(600, 0.06, "sine", 0.18);
        setTimeout(() => playTone(1200, 0.04, "sine", 0.12), 15);
        setTimeout(() => playTone(800, 0.03, "sine", 0.06), 40);
        break;
        
      case "success":
        // Epic ascending fanfare
        playChord([523, 659], 0.15);
        setTimeout(() => playChord([659, 784], 0.15), 100);
        setTimeout(() => playChord([784, 988], 0.2), 200);
        setTimeout(() => playChord([1047, 1319], 0.35), 320);
        break;
        
      case "reveal":
        // Dramatic magical reveal with shimmer
        playFrequencySweep(150, 400, 0.3, 0.08, "triangle");
        playNoise(0.15, 0.04, 4000);
        setTimeout(() => {
          playChord([392, 494, 587], 0.25);
        }, 150);
        setTimeout(() => {
          playChord([523, 659, 784], 0.35);
          playFrequencySweep(600, 1200, 0.2, 0.06);
        }, 300);
        setTimeout(() => {
          playTone(1047, 0.4, "sine", 0.12);
          playTone(1319, 0.4, "sine", 0.08);
        }, 450);
        break;
        
      case "submit":
        // Confident confirmation
        playTone(880, 0.05, "sine", 0.12);
        setTimeout(() => playTone(1100, 0.08, "sine", 0.15), 40);
        setTimeout(() => playTone(1320, 0.06, "sine", 0.08), 90);
        break;
        
      case "join":
        // Welcoming arrival chime
        playTone(440, 0.08, "sine", 0.1);
        setTimeout(() => playTone(554, 0.08, "sine", 0.12), 60);
        setTimeout(() => playTone(659, 0.12, "sine", 0.14), 120);
        setTimeout(() => playTone(880, 0.18, "sine", 0.1), 200);
        break;
        
      case "error":
        // Gentle but clear error
        playTone(280, 0.1, "triangle", 0.08);
        setTimeout(() => playTone(220, 0.15, "triangle", 0.06), 100);
        break;
        
      case "whoosh":
        // Smooth transition swoosh
        playNoise(0.18, 0.06, 3000);
        playFrequencySweep(500, 100, 0.15, 0.04);
        break;
        
      case "ding":
        // Crystal clear notification
        playTone(1047, 0.12, "sine", 0.15);
        playTone(1319, 0.12, "sine", 0.1);
        setTimeout(() => playTone(1568, 0.15, "sine", 0.08), 50);
        break;
        
      case "sweep":
        // Elegant UI transition
        playFrequencySweep(200, 600, 0.15, 0.06);
        setTimeout(() => playFrequencySweep(400, 800, 0.1, 0.04), 80);
        break;

      case "magic":
        // Sparkly magical sound
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const freq = 1200 + Math.random() * 600;
            playTone(freq, 0.08, "sine", 0.06);
          }, i * 50);
        }
        playFrequencySweep(400, 1000, 0.3, 0.05);
        break;

      case "powerup":
        // Energizing power-up
        playFrequencySweep(200, 800, 0.25, 0.1, "sawtooth");
        setTimeout(() => playChord([523, 659, 784, 1047], 0.3), 150);
        break;

      case "sparkle":
        // Twinkling sparkle
        const sparkleNotes = [1200, 1500, 1800, 1400, 1600];
        sparkleNotes.forEach((freq, i) => {
          setTimeout(() => playTone(freq, 0.05, "sine", 0.04), i * 40);
        });
        break;

      case "bounce":
        // Playful bouncy sound
        playTone(300, 0.08, "sine", 0.12);
        setTimeout(() => playTone(450, 0.06, "sine", 0.1), 60);
        setTimeout(() => playTone(600, 0.08, "sine", 0.08), 120);
        break;
    }
  }, [playTone, playNoise, playFrequencySweep, playChord]);

  return { playSound };
};
