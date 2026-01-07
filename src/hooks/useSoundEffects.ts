import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "reveal" | "submit" | "join" | "error";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }, [getAudioContext]);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case "click":
        // Soft click
        playTone(800, 0.05, "sine", 0.15);
        break;
      case "success":
        // Ascending chime
        playTone(523, 0.1, "sine", 0.2);
        setTimeout(() => playTone(659, 0.1, "sine", 0.2), 80);
        setTimeout(() => playTone(784, 0.15, "sine", 0.25), 160);
        break;
      case "reveal":
        // Dramatic reveal
        playTone(220, 0.3, "triangle", 0.15);
        setTimeout(() => playTone(330, 0.3, "triangle", 0.2), 100);
        setTimeout(() => playTone(440, 0.4, "triangle", 0.25), 200);
        break;
      case "submit":
        // Confirmation beep
        playTone(660, 0.08, "sine", 0.2);
        setTimeout(() => playTone(880, 0.12, "sine", 0.2), 60);
        break;
      case "join":
        // Welcome sound
        playTone(392, 0.15, "sine", 0.15);
        setTimeout(() => playTone(523, 0.2, "sine", 0.2), 120);
        break;
      case "error":
        // Error buzz
        playTone(200, 0.15, "sawtooth", 0.1);
        setTimeout(() => playTone(180, 0.15, "sawtooth", 0.1), 100);
        break;
    }
  }, [playTone]);

  return { playSound };
};
