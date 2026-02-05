import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameState, Room, Player, Round, GamePhase, PlayerRole } from "@/lib/gameTypes";
import { 
  generateRoomCode, 
  generateTarget, 
  getRandomExtremes, 
  calculateScore,
  generatePlayerId,
  generatePassword
} from "@/lib/gameConfig";
import { useToast } from "@/hooks/use-toast";

const getStoredPlayerId = (): string => {
  let playerId = localStorage.getItem("wavelength_player_id");
  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem("wavelength_player_id", playerId);
  }
  return playerId;
};

export const useGameState = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    room: null,
    players: [],
    currentRound: null,
    myPlayer: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [playerId] = useState(getStoredPlayerId);

  useEffect(() => {
    if (!gameState.room?.id) return;

    const roomId = gameState.room.id;

    const roomChannel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setGameState((prev) => ({
              ...prev,
              room: payload.new as Room,
            }));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Check if current player was kicked
          if (payload.eventType === "DELETE") {
            const deletedPlayer = payload.old as Player;
            if (deletedPlayer.player_id === playerId) {
              // Current player was kicked
              setGameState({
                room: null,
                players: [],
                currentRound: null,
                myPlayer: null,
              });
              toast({
                title: "Removed from room",
                description: "You have been removed from the game",
                variant: "destructive",
              });
              return;
            }
          }

          const { data: players } = await supabase
            .from("players")
            .select("*")
            .eq("room_id", roomId);
          
          if (players) {
            const myPlayer = players.find((p) => p.player_id === playerId) || null;
            setGameState((prev) => ({
              ...prev,
              players: players as Player[],
              myPlayer: myPlayer as Player | null,
            }));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rounds",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          const { data: rounds } = await supabase
            .from("rounds")
            .select("*")
            .eq("room_id", roomId)
            .order("round_number", { ascending: false })
            .limit(1);
          
          if (rounds && rounds.length > 0) {
            setGameState((prev) => ({
              ...prev,
              currentRound: rounds[0] as Round,
            }));
          }
        }
      )
      .subscribe();

    // Polling fallback: fixes cases where realtime updates don't arrive (e.g. opponent never loads)
    const pollId = window.setInterval(async () => {
      try {
        const [{ data: players }, { data: rounds }] = await Promise.all([
          supabase.from("players").select("*").eq("room_id", roomId),
          supabase
            .from("rounds")
            .select("*")
            .eq("room_id", roomId)
            .order("round_number", { ascending: false })
            .limit(1),
        ]);

        if (players) {
          const myPlayer = players.find((p) => p.player_id === playerId) || null;
          setGameState((prev) => ({
            ...prev,
            players: players as Player[],
            myPlayer: myPlayer as Player | null,
          }));
        }

        if (rounds && rounds.length > 0) {
          setGameState((prev) => ({
            ...prev,
            currentRound: rounds[0] as Round,
          }));
        }
      } catch (e) {
        console.warn("Polling sync failed:", e);
      }
    }, 2500);

    return () => {
      supabase.removeChannel(roomChannel);
      clearInterval(pollId);
    };
  }, [gameState.room?.id, playerId, toast]);

  const createRoom = useCallback(async (playerName: string, isPrivate: boolean = false) => {
    setIsLoading(true);
    try {
      const code = generateRoomCode();
      const password = isPrivate ? generatePassword() : null;
      
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({
          code,
          host_id: playerId,
          is_private: isPrivate,
          password,
          mode: "two_player",
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          room_id: room.id,
          player_id: playerId,
          name: playerName,
          is_host: true,
          role: "spectator" as PlayerRole,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setGameState({
        room: room as Room,
        players: [player as Player],
        currentRound: null,
        myPlayer: player as Player,
      });

      toast({
        title: "Room Created!",
        description: `Room code: ${code}`,
      });

      return room.code;
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playerId, toast]);

  const joinRoom = useCallback(async (code: string, playerName: string, password?: string) => {
    setIsLoading(true);
    try {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", code.toUpperCase())
        .single();

      if (roomError || !room) {
        toast({
          title: "Room Not Found",
          description: "Check the room code and try again",
          variant: "destructive",
        });
        return false;
      }

      // Check if room is private and requires password
      if (room.is_private && room.password && room.password !== password) {
        toast({
          title: "Incorrect Password",
          description: "The password you entered is incorrect",
          variant: "destructive",
        });
        return false;
      }

      const { data: existingPlayer } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", room.id)
        .eq("player_id", playerId)
        .maybeSingle();

      if (existingPlayer) {
        const { data: players } = await supabase
          .from("players")
          .select("*")
          .eq("room_id", room.id);

        const { data: rounds } = await supabase
          .from("rounds")
          .select("*")
          .eq("room_id", room.id)
          .order("round_number", { ascending: false })
          .limit(1);

        setGameState({
          room: room as Room,
          players: (players || []) as Player[],
          currentRound: rounds && rounds.length > 0 ? (rounds[0] as Round) : null,
          myPlayer: existingPlayer as Player,
        });

        return true;
      }

      const { data: players } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", room.id);

      if (players && players.length >= 8) {
        toast({
          title: "Room Full",
          description: "This room already has 8 players",
          variant: "destructive",
        });
        return false;
      }

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          room_id: room.id,
          player_id: playerId,
          name: playerName,
          is_host: false,
          role: "spectator" as PlayerRole,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      const allPlayers = [...(players || []), player] as Player[];

      const { data: rounds } = await supabase
        .from("rounds")
        .select("*")
        .eq("room_id", room.id)
        .order("round_number", { ascending: false })
        .limit(1);

      setGameState({
        room: room as Room,
        players: allPlayers,
        currentRound: rounds && rounds.length > 0 ? (rounds[0] as Round) : null,
        myPlayer: player as Player,
      });

      toast({
        title: "Joined Room!",
        description: `Welcome to room ${code}`,
      });

      return true;
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [playerId, toast]);

  const startRound = useCallback(async () => {
    if (!gameState.room || !gameState.myPlayer) return;
    if (isLoading) return; // Prevent double-starts
    
    setIsLoading(true);
    try {
      const target = generateTarget();
      const extremes = getRandomExtremes();
      
      if (gameState.players.length < 2) {
        toast({
          title: "Need 2+ Players",
          description: "Wait for another player to join",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if a round is already in progress to prevent race conditions
      const { data: existingActiveRound } = await supabase
        .from("rounds")
        .select("id, phase")
        .eq("room_id", gameState.room.id)
        .in("phase", ["clue_giving", "guessing", "reveal"])
        .limit(1);
      
      if (existingActiveRound && existingActiveRound.length > 0) {
        // Round already started by other player - silently skip
        setIsLoading(false);
        return;
      }

      // Get the last round to determine role swap
      const { data: lastRoundData } = await supabase
        .from("rounds")
        .select("round_number, psychic_id, guesser_id")
        .eq("room_id", gameState.room.id)
        .order("round_number", { ascending: false })
        .limit(1);

      const lastRound = lastRoundData?.[0];
      const roundNumber = lastRound ? lastRound.round_number + 1 : 1;

      // Sort player IDs for consistent ordering
      const sortedPlayerIds = [...gameState.players.map(p => p.player_id)].sort();
      
      let clueGiverId: string;
      let guesserId: string;
      
      if (!lastRound) {
        // First round - pick first two players
        clueGiverId = sortedPlayerIds[0];
        guesserId = sortedPlayerIds[1];
      } else {
        // STRICT SWAP: whoever was psychic becomes guesser, whoever was guesser becomes psychic
        clueGiverId = lastRound.guesser_id || sortedPlayerIds[0];
        guesserId = lastRound.psychic_id || sortedPlayerIds[1];
        
        // Validate both players still exist
        if (!sortedPlayerIds.includes(clueGiverId)) {
          clueGiverId = sortedPlayerIds[0];
        }
        if (!sortedPlayerIds.includes(guesserId) || guesserId === clueGiverId) {
          guesserId = sortedPlayerIds.find(id => id !== clueGiverId) || sortedPlayerIds[1];
        }
      }

      // Batch update all player roles
      const roleUpdates = gameState.players.map(player => 
        supabase
          .from("players")
          .update({ role: player.player_id === clueGiverId ? "psychic" : "guesser" as PlayerRole })
          .eq("room_id", gameState.room!.id)
          .eq("player_id", player.player_id)
      );
      await Promise.all(roleUpdates);

      const { error: roundError } = await supabase
        .from("rounds")
        .insert({
          room_id: gameState.room.id,
          round_number: roundNumber,
          phase: "clue_giving" as GamePhase,
          psychic_id: clueGiverId,
          target_center: target.center,
          target_width: target.width,
          left_extreme: extremes.left,
          right_extreme: extremes.right,
          guesser_id: guesserId,
        });

      if (roundError) throw roundError;

      await supabase
        .from("rooms")
        .update({ status: "playing" })
        .eq("id", gameState.room.id);

      toast({
        title: `Round ${roundNumber}`,
        description: clueGiverId === playerId ? "Your turn to give a clue!" : "Get ready to guess!",
      });
    } catch (error: unknown) {
      console.error("Error starting round:", error);
      // Only show error toast for actual errors, not race condition duplicates
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Supabase unique constraint violations are expected during race conditions
      if (!errorMessage.includes("duplicate") && !errorMessage.includes("unique")) {
        toast({
          title: "Error",
          description: "Failed to start round",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameState.room, gameState.myPlayer, gameState.players, playerId, toast, isLoading]);

  const submitClue = useCallback(async (clue: string) => {
    if (!gameState.currentRound) return;
    
    try {
      await supabase
        .from("rounds")
        .update({
          clue,
          phase: "guessing" as GamePhase,
        })
        .eq("id", gameState.currentRound.id);

      toast({
        title: "Clue Sent!",
        description: "Waiting for the guesser...",
      });
    } catch (error) {
      console.error("Error submitting clue:", error);
      toast({
        title: "Error",
        description: "Failed to submit clue",
        variant: "destructive",
      });
    }
  }, [gameState.currentRound, toast]);

  const submitGuess = useCallback(async (guessValue: number) => {
    if (!gameState.currentRound || !gameState.room) return;
    
    try {
      const round = gameState.currentRound;
      const targetCenter = round.target_center!;
      const targetWidth = round.target_width!;
      
      const points = calculateScore(Math.round(guessValue), targetCenter, targetWidth);
      
      await supabase
        .from("rounds")
        .update({
          guess_value: Math.round(guessValue),
          points_awarded: points,
          phase: "reveal" as GamePhase,
          completed_at: new Date().toISOString(),
        })
        .eq("id", gameState.currentRound.id);

      const guesserPlayer = gameState.players.find(p => p.player_id === round.guesser_id);
      if (guesserPlayer) {
        await supabase
          .from("players")
          .update({ score: guesserPlayer.score + points })
          .eq("id", guesserPlayer.id);
      }

      toast({
        title: "Guess Submitted!",
        description: `You scored ${points} points!`,
      });
    } catch (error) {
      console.error("Error submitting guess:", error);
      toast({
        title: "Error",
        description: "Failed to submit guess",
        variant: "destructive",
      });
    }
  }, [gameState.currentRound, gameState.room, gameState.players, toast]);

  const nextRound = useCallback(async () => {
    if (!gameState.currentRound) return;
    
    try {
      await supabase
        .from("rounds")
        .update({ phase: "complete" as GamePhase })
        .eq("id", gameState.currentRound.id);

      toast({
        title: "Round Complete!",
        description: "Ready for the next round",
      });
    } catch (error) {
      console.error("Error completing round:", error);
    }
  }, [gameState.currentRound, toast]);

  const leaveRoom = useCallback(async () => {
    if (!gameState.room || !gameState.myPlayer) return;
    
    try {
      await supabase
        .from("players")
        .delete()
        .eq("id", gameState.myPlayer.id);

      setGameState({
        room: null,
        players: [],
        currentRound: null,
        myPlayer: null,
      });

      toast({
        title: "Left Room",
        description: "You have left the room",
      });
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  }, [gameState.room, gameState.myPlayer, toast]);

  const kickPlayer = useCallback(async (playerIdToKick: string) => {
    if (!gameState.room || !gameState.myPlayer?.is_host) return;
    
    // Don't allow kicking yourself
    if (playerIdToKick === playerId) return;
    
    setIsLoading(true);
    try {
      const playerToKick = gameState.players.find(p => p.player_id === playerIdToKick);
      if (!playerToKick) {
        toast({
          title: "Error",
          description: "Player not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("players")
        .delete()
        .eq("room_id", gameState.room.id)
        .eq("player_id", playerIdToKick);

      if (error) throw error;

      toast({
        title: "Player Removed",
        description: `${playerToKick.name} has been removed from the room`,
      });
    } catch (error) {
      console.error("Error kicking player:", error);
      toast({
        title: "Error",
        description: "Failed to remove player",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameState.room, gameState.myPlayer, gameState.players, playerId, toast]);

  return {
    gameState,
    playerId,
    isLoading,
    createRoom,
    joinRoom,
    startRound,
    submitClue,
    submitGuess,
    nextRound,
    leaveRoom,
    kickPlayer,
  };
};
