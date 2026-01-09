import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "reveal" | "submit" | "join" | "error" | "whoosh" | "pop" | "ding" | "sweep";

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

  const playNoise = useCallback((duration: number, volume: number = 0.1) => {
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
      filter.frequency.value = 2000;
      
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

  const playFrequencySweep = useCallback((startFreq: number, endFreq: number, duration: number, volume: number = 0.15) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = "sine";
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

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case "click":
        // Soft pop click
        playTone(1200, 0.04, "sine", 0.08);
        break;
        
      case "pop":
        // Bubble pop
        playTone(400, 0.08, "sine", 0.15);
        setTimeout(() => playTone(800, 0.05, "sine", 0.1), 20);
        break;
        
      case "success":
        // Triumphant ascending arpeggio
        playTone(523, 0.12, "triangle", 0.18);
        setTimeout(() => playTone(659, 0.12, "triangle", 0.2), 80);
        setTimeout(() => playTone(784, 0.15, "triangle", 0.22), 160);
        setTimeout(() => playTone(1047, 0.25, "triangle", 0.18), 260);
        break;
        
      case "reveal":
        // Dramatic reveal with sweep and shimmer
        playFrequencySweep(200, 600, 0.4, 0.12);
        setTimeout(() => {
          playTone(523, 0.2, "triangle", 0.15);
          playTone(659, 0.2, "triangle", 0.12);
        }, 200);
        setTimeout(() => {
          playTone(784, 0.3, "triangle", 0.18);
          playTone(1047, 0.3, "triangle", 0.1);
        }, 350);
        break;
        
      case "submit":
        // Crisp confirmation
        playTone(880, 0.06, "sine", 0.15);
        setTimeout(() => playTone(1100, 0.1, "sine", 0.12), 50);
        break;
        
      case "join":
        // Welcoming chime
        playTone(392, 0.1, "sine", 0.12);
        setTimeout(() => playTone(494, 0.1, "sine", 0.14), 80);
        setTimeout(() => playTone(587, 0.15, "sine", 0.16), 160);
        break;
        
      case "error":
        // Soft error
        playTone(220, 0.12, "square", 0.06);
        setTimeout(() => playTone(180, 0.15, "square", 0.05), 80);
        break;
        
      case "whoosh":
        // Transition swoosh
        playNoise(0.15, 0.08);
        playFrequencySweep(400, 100, 0.12, 0.05);
        break;
        
      case "ding":
        // Pleasant notification ding
        playTone(1047, 0.15, "sine", 0.12);
        playTone(1319, 0.15, "sine", 0.08);
        break;
        
      case "sweep":
        // UI sweep transition
        playFrequencySweep(300, 800, 0.2, 0.06);
        break;
    }
  }, [playTone, playNoise, playFrequencySweep]);

  return { playSound };
};
