import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "reveal" | "submit" | "join" | "error" | "whoosh" | "pop" | "ding" | "sweep" | "magic" | "powerup" | "sparkle" | "bounce" | "fanfare" | "swoosh" | "chime";

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

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case "click":
        // Crisp satisfying click
        playTone(2200, 0.025, "sine", 0.08);
        playTone(1800, 0.02, "sine", 0.04, true, 0.01);
        break;
        
      case "pop":
        // Juicy bubble pop
        playTone(500, 0.05, "sine", 0.2);
        playTone(1000, 0.04, "sine", 0.15, true, 0.015);
        playTone(700, 0.03, "sine", 0.08, true, 0.04);
        playNoise(0.03, 0.03, 6000, 0.02);
        break;
        
      case "success":
        // Epic triumphant fanfare
        playChord([523, 659], 0.12);
        playChord([659, 784], 0.12, 0.08, 0.1);
        playChord([784, 988], 0.15, 0.08, 0.2);
        playChord([1047, 1319, 1568], 0.4, 0.1, 0.35);
        playFrequencySweep(800, 1600, 0.3, 0.05, "sine", 0.35);
        break;
        
      case "reveal":
        // Magical dramatic reveal
        playNoise(0.2, 0.05, 4000);
        playFrequencySweep(120, 350, 0.35, 0.1, "triangle");
        playArpeggio([330, 392, 494, 587, 659], 0.12, 0.08, 0.08);
        playChord([523, 659, 784, 1047], 0.45, 0.08, 0.4);
        playFrequencySweep(500, 1200, 0.25, 0.05, "sine", 0.45);
        break;
        
      case "submit":
        // Confident satisfying confirm
        playTone(880, 0.04, "sine", 0.12);
        playTone(1100, 0.06, "sine", 0.15, true, 0.03);
        playTone(1320, 0.08, "sine", 0.1, true, 0.07);
        playNoise(0.02, 0.02, 5000, 0.04);
        break;
        
      case "join":
        // Welcoming melodic arrival
        playArpeggio([440, 554, 659, 880], 0.1, 0.07, 0.12);
        playTone(1047, 0.2, "sine", 0.08, true, 0.3);
        break;
        
      case "error":
        // Gentle but clear error
        playTone(280, 0.1, "triangle", 0.1);
        playTone(220, 0.15, "triangle", 0.08, true, 0.08);
        break;
        
      case "whoosh":
        // Smooth elegant swoosh
        playNoise(0.2, 0.08, 3500);
        playFrequencySweep(600, 80, 0.18, 0.06);
        playFrequencySweep(400, 100, 0.12, 0.03, "triangle", 0.05);
        break;
        
      case "ding":
        // Crystal clear bell
        playTone(1047, 0.15, "sine", 0.18);
        playTone(1319, 0.12, "sine", 0.12, true, 0.02);
        playTone(1568, 0.2, "sine", 0.08, true, 0.05);
        playTone(2093, 0.1, "sine", 0.04, true, 0.08);
        break;
        
      case "sweep":
        // Elegant UI transition
        playFrequencySweep(180, 700, 0.18, 0.08);
        playFrequencySweep(350, 900, 0.12, 0.05, "triangle", 0.06);
        break;

      case "magic":
        // Enchanting sparkle cascade
        for (let i = 0; i < 6; i++) {
          const freq = 1000 + Math.random() * 800;
          playTone(freq, 0.1, "sine", 0.05, true, i * 0.04);
        }
        playFrequencySweep(300, 900, 0.35, 0.06, "triangle");
        playChord([659, 784, 988], 0.25, 0.04, 0.15);
        break;

      case "powerup":
        // Energizing power surge
        playFrequencySweep(150, 700, 0.3, 0.12, "sawtooth");
        playFrequencySweep(200, 900, 0.25, 0.08, "triangle", 0.05);
        playChord([523, 659, 784, 1047], 0.35, 0.08, 0.18);
        playTone(1319, 0.2, "sine", 0.06, true, 0.3);
        break;

      case "sparkle":
        // Twinkling sparkle shower
        const sparkleNotes = [1400, 1700, 2000, 1600, 1900, 1500, 1800];
        sparkleNotes.forEach((freq, i) => {
          playTone(freq, 0.06, "sine", 0.05 - i * 0.005, true, i * 0.035);
        });
        break;

      case "bounce":
        // Playful bouncy
        playTone(280, 0.06, "sine", 0.14);
        playTone(420, 0.05, "sine", 0.12, true, 0.05);
        playTone(560, 0.06, "sine", 0.1, true, 0.1);
        playTone(700, 0.08, "sine", 0.08, true, 0.15);
        break;

      case "fanfare":
        // Grand celebration
        playChord([392, 494], 0.15, 0.1);
        playChord([494, 587], 0.15, 0.1, 0.12);
        playChord([587, 698], 0.15, 0.1, 0.24);
        playChord([784, 988, 1175], 0.5, 0.12, 0.4);
        playFrequencySweep(600, 1400, 0.35, 0.06, "sine", 0.4);
        break;

      case "swoosh":
        // Quick transition swoosh
        playNoise(0.12, 0.06, 4000);
        playFrequencySweep(800, 200, 0.1, 0.04);
        break;

      case "chime":
        // Gentle notification chime
        playTone(880, 0.12, "sine", 0.1);
        playTone(1108, 0.12, "sine", 0.08, true, 0.04);
        playTone(1320, 0.15, "sine", 0.06, true, 0.08);
        break;
    }
  }, [playTone, playNoise, playFrequencySweep, playChord, playArpeggio]);

  return { playSound };
};
