import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spectrum } from "./Spectrum";
import { GameState, Round } from "@/lib/gameTypes";
import { 
  Users, 
  Crown, 
  Eye, 
  Crosshair, 
  Send, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Trophy,
  Sparkles,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GameRoomProps {
  gameState: GameState;
  playerId: string;
  isLoading: boolean;
  onStartRound: () => Promise<void>;
  onSubmitClue: (clue: string) => Promise<void>;
  onSubmitGuess: (value: number) => Promise<void>;
  onPredictSide: (side: "left" | "right") => Promise<void>;
  onNextRound: () => Promise<void>;
  onLeaveRoom: () => Promise<void>;
}

export const GameRoom: React.FC<GameRoomProps> = ({
  gameState,
  playerId,
  isLoading,
  onStartRound,
  onSubmitClue,
  onSubmitGuess,
  onPredictSide,
  onNextRound,
  onLeaveRoom,
}) => {
  const { toast } = useToast();
  const [clue, setClue] = useState("");
  const [guessValue, setGuessValue] = useState(50);
  
  const { room, players, currentRound, myPlayer } = gameState;
  
  if (!room || !myPlayer) return null;

  const isPsychic = myPlayer.role === "psychic";
  const isGuesser = myPlayer.role === "guesser";
  const otherPlayer = players.find(p => p.player_id !== playerId);
  const canStartRound = myPlayer.is_host && players.length >= 2;
  const isWaitingPhase = !currentRound || currentRound.phase === "complete" || currentRound.phase === "waiting";

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const handleSubmitClue = async () => {
    if (!clue.trim()) return;
    await onSubmitClue(clue.trim());
    setClue("");
  };

  const handleSubmitGuess = async () => {
    await onSubmitGuess(guessValue);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onLeaveRoom}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave
        </Button>
        
        <button
          onClick={copyRoomCode}
          className="flex items-center gap-2 glass-panel px-4 py-2 hover:bg-muted/50 transition-colors"
        >
          <span className="font-display text-xl tracking-wider">{room.code}</span>
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              "glass-panel p-4 flex items-center gap-3",
              player.player_id === playerId && "neon-border"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              player.role === "psychic" 
                ? "bg-secondary text-secondary-foreground" 
                : player.role === "guesser"
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {player.role === "psychic" ? (
                <Eye className="w-5 h-5" />
              ) : player.role === "guesser" ? (
                <Crosshair className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm truncate">{player.name}</span>
                {player.is_host && <Crown className="w-4 h-4 text-warning flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{player.role}</span>
                <span>•</span>
                <span className="font-display">{player.score} pts</span>
              </div>
            </div>
          </div>
        ))}
        
        {players.length < 2 && (
          <div className="glass-panel p-4 flex items-center justify-center border-dashed border-2 border-border">
            <span className="text-muted-foreground text-sm">Waiting for player...</span>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Waiting for players */}
        {isWaitingPhase && (
          <div className="text-center space-y-6 animate-slide-up">
            {players.length < 2 ? (
              <>
                <div className="animate-float">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">
                  Waiting for another player to join...
                </p>
                <p className="text-sm text-muted-foreground">
                  Share code: <span className="font-display text-primary">{room.code}</span>
                </p>
              </>
            ) : canStartRound ? (
              <>
                <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse-glow" />
                <p className="text-xl">Ready to play!</p>
                <Button
                  variant="neon"
                  size="xl"
                  onClick={onStartRound}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Round"}
                </Button>
              </>
            ) : (
              <>
                <div className="animate-float">
                  <Sparkles className="w-16 h-16 mx-auto text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">
                  Waiting for host to start...
                </p>
              </>
            )}
          </div>
        )}

        {/* Psychic Viewing Target */}
        {currentRound?.phase === "psychic_viewing" && (
          <div className="w-full max-w-2xl space-y-8 animate-slide-up">
            {isPsychic ? (
              <>
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary-foreground">
                    <Eye className="w-5 h-5" />
                    <span className="font-display uppercase tracking-wider">You are the Psychic</span>
                  </span>
                </div>
                <Spectrum
                  leftLabel={currentRound.left_extreme}
                  rightLabel={currentRound.right_extreme}
                  targetCenter={currentRound.target_center!}
                  targetWidth={currentRound.target_width!}
                  showTarget={true}
                />
                <p className="text-center text-muted-foreground">
                  The target zone is shown above. Type a clue that places something on this spectrum.
                </p>
                <div className="flex gap-3">
                  <Input
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder="Enter your clue..."
                    maxLength={100}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitClue()}
                  />
                  <Button
                    variant="neon"
                    size="default"
                    onClick={handleSubmitClue}
                    disabled={!clue.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-float">
                  <Eye className="w-16 h-16 mx-auto text-secondary" />
                </div>
                <p className="text-xl">The Psychic is viewing the target...</p>
                <p className="text-muted-foreground">Get ready to guess!</p>
              </div>
            )}
          </div>
        )}

        {/* Clue Giving Phase (same as above but for display) */}
        {currentRound?.phase === "clue_giving" && (
          <div className="w-full max-w-2xl space-y-8 animate-slide-up">
            {isPsychic ? (
              <>
                <Spectrum
                  leftLabel={currentRound.left_extreme}
                  rightLabel={currentRound.right_extreme}
                  targetCenter={currentRound.target_center!}
                  targetWidth={currentRound.target_width!}
                  showTarget={true}
                />
                <div className="flex gap-3">
                  <Input
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    placeholder="Enter your clue..."
                    maxLength={100}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitClue()}
                  />
                  <Button
                    variant="neon"
                    onClick={handleSubmitClue}
                    disabled={!clue.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <Eye className="w-16 h-16 mx-auto text-secondary animate-pulse-glow" />
                <p className="text-xl">The Psychic is thinking of a clue...</p>
              </div>
            )}
          </div>
        )}

        {/* Guessing Phase */}
        {currentRound?.phase === "guessing" && (
          <div className="w-full max-w-2xl space-y-8 animate-slide-up">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">The clue is:</p>
              <p className="text-3xl md:text-4xl font-display neon-text">
                "{currentRound.clue}"
              </p>
            </div>

            <Spectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              guessValue={guessValue}
              onGuessChange={setGuessValue}
              isDraggable={isGuesser}
            />

            {isGuesser ? (
              <div className="text-center">
                <Button
                  variant="neon"
                  size="xl"
                  onClick={handleSubmitGuess}
                  disabled={isLoading}
                >
                  <Check className="w-5 h-5" />
                  Confirm Guess
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Waiting for the Guesser to make their guess...
              </p>
            )}
          </div>
        )}

        {/* Predicting Phase */}
        {currentRound?.phase === "predicting" && (
          <div className="w-full max-w-2xl space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Clue: "{currentRound.clue}"</p>
              <p className="text-xl">
                The guess is at <span className="font-display text-primary">{currentRound.guess_value}</span>
              </p>
            </div>

            <Spectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              guessValue={currentRound.guess_value!}
            />

            {isPsychic ? (
              <div className="text-center space-y-4">
                <p className="text-lg">Is the actual target to the LEFT or RIGHT of the guess?</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="game"
                    size="xl"
                    onClick={() => onPredictSide("left")}
                    disabled={isLoading}
                    className="flex-1 max-w-40"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Left
                  </Button>
                  <Button
                    variant="game"
                    size="xl"
                    onClick={() => onPredictSide("right")}
                    disabled={isLoading}
                    className="flex-1 max-w-40"
                  >
                    Right
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                The Psychic is predicting which side the target is on...
              </p>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {currentRound?.phase === "reveal" && (
          <div className="w-full max-w-2xl space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Clue: "{currentRound.clue}"</p>
            </div>

            <Spectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              targetCenter={currentRound.target_center!}
              targetWidth={currentRound.target_width!}
              guessValue={currentRound.guess_value!}
              showReveal={true}
            />

            {/* Results */}
            <div className="glass-panel p-6 space-y-4 animate-reveal">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-warning" />
                <span className="text-3xl font-display">
                  {currentRound.points_awarded} Points!
                </span>
              </div>
              
              {currentRound.predicted_side && (
                <p className={cn(
                  "text-center",
                  currentRound.prediction_correct ? "text-success" : "text-muted-foreground"
                )}>
                  Prediction was {currentRound.prediction_correct ? "correct! (+1 bonus)" : "incorrect"}
                </p>
              )}

              <div className="flex justify-center pt-4">
                {canStartRound ? (
                  <Button
                    variant="neon"
                    size="lg"
                    onClick={onNextRound}
                    disabled={isLoading}
                  >
                    Next Round
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <p className="text-muted-foreground">Waiting for host...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
