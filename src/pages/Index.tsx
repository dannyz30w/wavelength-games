import React from "react";
import { Helmet } from "react-helmet-async";
import { Lobby } from "@/components/game/Lobby";
import { GameRoom } from "@/components/game/GameRoom";
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
    predictSide,
    nextRound,
    leaveRoom,
  } = useGameState();

  const isInRoom = gameState.room !== null;

  return (
    <>
      <Helmet>
        <title>Wavelength - Mind Reading Party Game</title>
        <meta name="description" content="Play Wavelength online! A mind-reading party game where you try to guess where the Psychic's clue falls on the spectrum." />
      </Helmet>

      {isInRoom ? (
        <GameRoom
          gameState={gameState}
          playerId={playerId}
          isLoading={isLoading}
          onStartRound={startRound}
          onSubmitClue={submitClue}
          onSubmitGuess={submitGuess}
          onPredictSide={predictSide}
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
