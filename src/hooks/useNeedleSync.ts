import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NeedleSyncOptions {
  roomId: string | undefined;
  roundId: string | undefined;
  isGuesser: boolean;
  playerId: string;
}

export const useNeedleSync = ({ roomId, roundId, isGuesser, playerId }: NeedleSyncOptions) => {
  const [remoteNeedleAngle, setRemoteNeedleAngle] = useState<number>(90);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastSentAngleRef = useRef<number>(90);
  const throttleRef = useRef<number | null>(null);

  // Broadcast needle position (from guesser)
  const broadcastNeedlePosition = useCallback((angle: number) => {
    if (!channelRef.current || !isGuesser) return;
    
    // Throttle broadcasts to reduce network load (max 20 updates per second)
    if (throttleRef.current) return;
    
    // Only broadcast if angle changed significantly (more than 0.5 degrees)
    if (Math.abs(angle - lastSentAngleRef.current) < 0.5) return;
    
    lastSentAngleRef.current = angle;
    
    channelRef.current.send({
      type: "broadcast",
      event: "needle_move",
      payload: {
        angle,
        playerId,
        timestamp: Date.now(),
      },
    });

    throttleRef.current = window.setTimeout(() => {
      throttleRef.current = null;
    }, 50); // 50ms throttle = max 20 updates/second
  }, [isGuesser, playerId]);

  // Set up channel subscription
  useEffect(() => {
    if (!roomId || !roundId) return;

    const channelName = `needle-sync-${roomId}-${roundId}`;
    
    channelRef.current = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    // Listen for needle movements if we're the clue giver (watching)
    if (!isGuesser) {
      channelRef.current.on("broadcast", { event: "needle_move" }, (payload) => {
        const { angle } = payload.payload as { angle: number; playerId: string };
        setRemoteNeedleAngle(angle);
      });
    }

    channelRef.current.subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, [roomId, roundId, isGuesser]);

  // Reset angle when round changes
  useEffect(() => {
    setRemoteNeedleAngle(90);
    lastSentAngleRef.current = 90;
  }, [roundId]);

  return {
    remoteNeedleAngle,
    broadcastNeedlePosition,
  };
};
