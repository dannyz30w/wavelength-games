import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generatePlayerId, generateRoomCode } from "@/lib/gameConfig";
import { useToast } from "@/hooks/use-toast";

interface MatchmakingState {
  status: "idle" | "searching" | "matched" | "error";
  roomCode: string | null;
  elapsedTime: number;
}

const getStoredPlayerId = (): string => {
  let playerId = localStorage.getItem("wavelength_player_id");
  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem("wavelength_player_id", playerId);
  }
  return playerId;
};

export const useMatchmaking = () => {
  const { toast } = useToast();
  const [state, setState] = useState<MatchmakingState>({
    status: "idle",
    roomCode: null,
    elapsedTime: 0,
  });
  const [playerId] = useState(getStoredPlayerId);
  const timerRef = useRef<number | null>(null);
  const queueIdRef = useRef<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Cleanup function
  const cleanup = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  // Start searching for a match
  const startSearch = useCallback(async (playerName: string) => {
    setState({ status: "searching", roomCode: null, elapsedTime: 0 });

    try {
      // First, cancel any existing queue entries
      await supabase
        .from("matchmaking_queue")
        .update({ status: "cancelled" })
        .eq("player_id", playerId)
        .eq("status", "waiting");

      // Add to queue
      const { data: queueEntry, error } = await supabase
        .from("matchmaking_queue")
        .insert({
          player_id: playerId,
          player_name: playerName,
          status: "waiting",
        })
        .select()
        .single();

      if (error) throw error;
      queueIdRef.current = queueEntry.id;

      // Start elapsed timer
      timerRef.current = window.setInterval(() => {
        setState(prev => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
      }, 1000);

      // Check for another waiting player
      const { data: waitingPlayers } = await supabase
        .from("matchmaking_queue")
        .select("*")
        .eq("status", "waiting")
        .neq("player_id", playerId)
        .order("created_at", { ascending: true })
        .limit(1);

      if (waitingPlayers && waitingPlayers.length > 0) {
        // Found a match! Create room
        const otherPlayer = waitingPlayers[0];
        const roomCode = generateRoomCode();

        // Create the room
        const { data: room, error: roomError } = await supabase
          .from("rooms")
          .insert({
            code: roomCode,
            host_id: playerId,
            is_private: false,
            mode: "two_player",
          })
          .select()
          .single();

        if (roomError) throw roomError;

        // Update both queue entries
        await Promise.all([
          supabase
            .from("matchmaking_queue")
            .update({ status: "matched", matched_room_id: room.id })
            .eq("id", queueEntry.id),
          supabase
            .from("matchmaking_queue")
            .update({ status: "matched", matched_room_id: room.id })
            .eq("id", otherPlayer.id),
        ]);

        cleanup();
        setState({ status: "matched", roomCode, elapsedTime: 0 });
        toast({
          title: "Match Found!",
          description: "Joining game...",
        });
        return;
      }

      // Subscribe to queue changes to detect when matched
      channelRef.current = supabase
        .channel(`matchmaking-${queueEntry.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "matchmaking_queue",
            filter: `id=eq.${queueEntry.id}`,
          },
          async (payload) => {
            const updated = payload.new as { status: string; matched_room_id: string | null };
            if (updated.status === "matched" && updated.matched_room_id) {
              // Get room code
              const { data: room } = await supabase
                .from("rooms")
                .select("code")
                .eq("id", updated.matched_room_id)
                .single();

              if (room) {
                cleanup();
                setState({ status: "matched", roomCode: room.code, elapsedTime: 0 });
                toast({
                  title: "Match Found!",
                  description: "Joining game...",
                });
              }
            }
          }
        )
        .subscribe();

      // Also listen for new queue entries (in case we need to match them)
      const matchChannel = supabase
        .channel(`matchmaking-new-${playerId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "matchmaking_queue",
          },
          async (payload) => {
            const newEntry = payload.new as { id: string; player_id: string; status: string };
            if (newEntry.player_id !== playerId && newEntry.status === "waiting") {
              // Check if we're still waiting
              const { data: myEntry } = await supabase
                .from("matchmaking_queue")
                .select("*")
                .eq("id", queueIdRef.current!)
                .single();

              if (myEntry && myEntry.status === "waiting") {
                // Create a room!
                const roomCode = generateRoomCode();
                const { data: room, error: roomError } = await supabase
                  .from("rooms")
                  .insert({
                    code: roomCode,
                    host_id: playerId,
                    is_private: false,
                    mode: "two_player",
                  })
                  .select()
                  .single();

                if (!roomError && room) {
                  await Promise.all([
                    supabase
                      .from("matchmaking_queue")
                      .update({ status: "matched", matched_room_id: room.id })
                      .eq("id", myEntry.id),
                    supabase
                      .from("matchmaking_queue")
                      .update({ status: "matched", matched_room_id: room.id })
                      .eq("id", newEntry.id),
                  ]);

                  cleanup();
                  setState({ status: "matched", roomCode, elapsedTime: 0 });
                  toast({
                    title: "Match Found!",
                    description: "Joining game...",
                  });
                }
              }
            }
          }
        )
        .subscribe();

      // Store for cleanup
      const originalCleanup = cleanup;
      channelRef.current = matchChannel;

    } catch (error) {
      console.error("Matchmaking error:", error);
      cleanup();
      setState({ status: "error", roomCode: null, elapsedTime: 0 });
      toast({
        title: "Error",
        description: "Failed to start matchmaking",
        variant: "destructive",
      });
    }
  }, [playerId, toast, cleanup]);

  // Cancel search
  const cancelSearch = useCallback(async () => {
    if (queueIdRef.current) {
      await supabase
        .from("matchmaking_queue")
        .update({ status: "cancelled" })
        .eq("id", queueIdRef.current);
    }
    cleanup();
    setState({ status: "idle", roomCode: null, elapsedTime: 0 });
  }, [cleanup]);

  // Reset state
  const reset = useCallback(() => {
    cleanup();
    setState({ status: "idle", roomCode: null, elapsedTime: 0 });
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    startSearch,
    cancelSearch,
    reset,
  };
};
