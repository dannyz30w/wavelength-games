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

    const roomChannel = supabase
      .channel(`room-${gameState.room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${gameState.room.id}`,
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
          filter: `room_id=eq.${gameState.room.id}`,
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
            .eq("room_id", gameState.room!.id);
          
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
          filter: `room_id=eq.${gameState.room.id}`,
        },
        async () => {
          const { data: rounds } = await supabase
            .from("rounds")
            .select("*")
            .eq("room_id", gameState.room!.id)
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

    return () => {
      supabase.removeChannel(roomChannel);
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
    
    setIsLoading(true);
    try {
      const target = generateTarget();
      const extremes = getRandomExtremes();
      
      const otherPlayers = gameState.players.filter(p => p.player_id !== playerId);
      
      if (otherPlayers.length === 0) {
        toast({
          title: "Need 2+ Players",
          description: "Wait for another player to join",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Fetch ALL rounds for this room to understand role history
      const { data: allRounds } = await supabase
        .from("rounds")
        .select("round_number, psychic_id, guesser_id")
        .eq("room_id", gameState.room.id)
        .order("round_number", { ascending: true });

      const roundNumber = allRounds && allRounds.length > 0 
        ? allRounds[allRounds.length - 1].round_number + 1 
        : 1;

      // Get all player IDs and sort them for consistent ordering
      const allPlayerIds = [...gameState.players.map(p => p.player_id)].sort();
      const numPlayers = allPlayerIds.length;
      
      // Build a role history per player: track their last role
      const lastRoleMap: Record<string, 'psychic' | 'guesser' | null> = {};
      allPlayerIds.forEach(pid => lastRoleMap[pid] = null);
      
      if (allRounds && allRounds.length > 0) {
        // Go through rounds and track each player's most recent role
        for (const round of allRounds) {
          if (round.psychic_id) lastRoleMap[round.psychic_id] = 'psychic';
          if (round.guesser_id) lastRoleMap[round.guesser_id] = 'guesser';
        }
      }

      // Find players who were guessers last time (they should give clues now)
      // Find players who were clue givers last time (they should guess now)
      const lastGuessers = allPlayerIds.filter(pid => lastRoleMap[pid] === 'guesser');
      const lastPsychics = allPlayerIds.filter(pid => lastRoleMap[pid] === 'psychic');
      const noRoleYet = allPlayerIds.filter(pid => lastRoleMap[pid] === null);
      
      let clueGiverId: string;
      let guesserId: string;
      
      if (numPlayers === 2) {
        // Simple 2-player alternation
        // Whoever guessed last should now give the clue
        // Whoever gave the clue last should now guess
        if (allRounds && allRounds.length > 0) {
          const lastRound = allRounds[allRounds.length - 1];
          // The last guesser becomes the new clue giver
          clueGiverId = lastRound.guesser_id || allPlayerIds[0];
          // The last clue giver becomes the new guesser
          guesserId = lastRound.psychic_id || allPlayerIds[1];
        } else {
          // First round - pick arbitrarily
          clueGiverId = allPlayerIds[0];
          guesserId = allPlayerIds[1];
        }
      } else {
        // Multi-player: rotate through players, ensuring alternation
        // Priority: pick someone who was a guesser last (or has no role yet) to be clue giver
        // Then pick someone who was a clue giver last (or has no role yet) to be guesser
        
        // For clue giver: prefer someone who guessed last or hasn't played
        const clueGiverCandidates = [...lastGuessers, ...noRoleYet];
        if (clueGiverCandidates.length > 0) {
          // Use round number for rotation within candidates
          clueGiverId = clueGiverCandidates[(roundNumber - 1) % clueGiverCandidates.length];
        } else {
          // Fallback: just rotate through all players
          clueGiverId = allPlayerIds[(roundNumber - 1) % numPlayers];
        }
        
        // For guesser: prefer someone who gave clue last or hasn't played, but not the clue giver
        const guesserCandidates = [...lastPsychics, ...noRoleYet].filter(pid => pid !== clueGiverId);
        if (guesserCandidates.length > 0) {
          guesserId = guesserCandidates[(roundNumber - 1) % guesserCandidates.length];
        } else {
          // Fallback: pick someone different from clue giver
          const otherPlayers = allPlayerIds.filter(pid => pid !== clueGiverId);
          guesserId = otherPlayers[(roundNumber - 1) % otherPlayers.length];
        }
      }

      // Update all players' roles
      for (const player of gameState.players) {
        const role: PlayerRole = player.player_id === clueGiverId ? "psychic" : "guesser";
        await supabase
          .from("players")
          .update({ role })
          .eq("room_id", gameState.room.id)
          .eq("player_id", player.player_id);
      }

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
        })
        .select()
        .single();

      if (roundError) throw roundError;

      await supabase
        .from("rooms")
        .update({ status: "playing" })
        .eq("id", gameState.room.id);

      const isClueGiver = clueGiverId === playerId;
      toast({
        title: `Round ${roundNumber}`,
        description: isClueGiver ? "Your turn to give a clue!" : "Get ready to guess!",
      });
    } catch (error) {
      console.error("Error starting round:", error);
      toast({
        title: "Error",
        description: "Failed to start round",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameState.room, gameState.myPlayer, gameState.players, playerId, toast]);

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
