import React from "react";
import { Helmet } from "react-helmet-async";
import { Lobby } from "@/components/game/Lobby";
import { GameRoom } from "@/components/game/GameRoom";
import { ThemeBackground } from "@/components/game/ThemeBackground";
import { ThemeSelector } from "@/components/game/ThemeSelector";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const {
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
  } = useGameState();

  const isInRoom = gameState.room !== null;

  return (
    <>
      <Helmet>
        <title>Wavelength - Mind Reading Party Game</title>
        <meta name="description" content="Play Wavelength online! A fun party game where you try to guess where the clue falls on the spectrum." />
      </Helmet>

      <ThemeBackground />
      
      {/* Theme selector - shown in lobby */}
      {!isInRoom && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeSelector />
        </div>
      )}

      {isInRoom ? (
        <GameRoom
          gameState={gameState}
          playerId={playerId}
          isLoading={isLoading}
          onStartRound={startRound}
          onSubmitClue={submitClue}
          onSubmitGuess={submitGuess}
          onNextRound={nextRound}
          onLeaveRoom={leaveRoom}
        />
      ) : (
        <Lobby
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Index;
