import { useState, useEffect, useCallback, useRef } from "react";
import { generatePlayerId } from "@/lib/gameConfig";
import { useToast } from "@/hooks/use-toast";
import { cancelMatchmake, matchmakeTwoPlayer } from "@/lib/matchmakingApi";

interface MatchmakingState {
  status: "idle" | "searching" | "matched" | "error";
  roomCode: string | null;
  elapsedTime: number;
  playerName: string | null;
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
    playerName: null,
  });

  const [playerId] = useState(getStoredPlayerId);
  const timerRef = useRef<number | null>(null);
  const pollingRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const completeMatch = useCallback(
    (roomCode: string, playerName: string) => {
      cleanup();
      setState({ status: "matched", roomCode, elapsedTime: 0, playerName });
      toast({
        title: "Match Found!",
        description: "Joining game...",
      });
    },
    [cleanup, toast]
  );

  const startSearch = useCallback(
    async (playerName: string) => {
      cleanup();
      setState({ status: "searching", roomCode: null, elapsedTime: 0, playerName });

      // Start elapsed timer
      timerRef.current = window.setInterval(() => {
        setState((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
      }, 1000);

      try {
        // Best-effort cancel any previous waiting search for this player
        await cancelMatchmake(playerId);

        const tick = async () => {
          if (inFlightRef.current) return;
          inFlightRef.current = true;

          try {
            const result = await matchmakeTwoPlayer(playerId, playerName);

            if (result.status === "matched") {
              completeMatch(result.room_code, playerName);
              return;
            }

            if (result.status === "error") {
              console.error("Matchmaking error:", result.message);
              cleanup();
              setState({ status: "error", roomCode: null, elapsedTime: 0, playerName: null });
              toast({
                title: "Error",
                description: "Failed to start matchmaking",
                variant: "destructive",
              });
            }
          } finally {
            inFlightRef.current = false;
          }
        };

        // First attempt immediately
        await tick();

        // Poll until matched (the backend returns the existing match if it already happened)
        pollingRef.current = window.setInterval(() => void tick(), 2000);
      } catch (error) {
        console.error("Matchmaking error:", error);
        cleanup();
        setState({ status: "error", roomCode: null, elapsedTime: 0, playerName: null });
        toast({
          title: "Error",
          description: "Failed to start matchmaking",
          variant: "destructive",
        });
      }
    },
    [cleanup, completeMatch, playerId, toast]
  );

  const cancelSearch = useCallback(async () => {
    try {
      await cancelMatchmake(playerId);
    } finally {
      cleanup();
      setState({ status: "idle", roomCode: null, elapsedTime: 0, playerName: null });
    }
  }, [cleanup, playerId]);

  const reset = useCallback(() => {
    cleanup();
    setState({ status: "idle", roomCode: null, elapsedTime: 0, playerName: null });
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);

  return {
    ...state,
    startSearch,
    cancelSearch,
    reset,
  };
};
