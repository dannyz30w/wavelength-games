import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SemicircleSpectrum } from "./SemicircleSpectrum";
import { GameState } from "@/lib/gameTypes";
import { 
  Users, 
  Crown, 
  Eye, 
  Target, 
  Send, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Trophy,
  Sparkles,
  Copy,
  EyeOff
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
  onNextRound,
  onLeaveRoom,
}) => {
  const { toast } = useToast();
  const [clue, setClue] = useState("");
  const [needleAngle, setNeedleAngle] = useState(90);
  const [targetHidden, setTargetHidden] = useState(false);
  
  const { room, players, currentRound, myPlayer } = gameState;
  
  if (!room || !myPlayer) return null;

  const isClueGiver = currentRound?.psychic_id === playerId;
  const isGuesser = currentRound?.guesser_id === playerId;
  const canStartRound = players.length >= 2;
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
    setTargetHidden(true);
  };

  const handleSubmitGuess = async () => {
    // Convert angle to 0-100 scale for scoring
    // Angle 0 = 0 (right), Angle 180 = 100 (left)
    const guessValue = (needleAngle / 180) * 100;
    await onSubmitGuess(guessValue);
  };

  const handleHideTarget = () => {
    setTargetHidden(true);
  };

  // Convert target center from 0-100 to 0-180 degrees
  const getTargetAngle = (value: number) => (value / 100) * 180;

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

        <div className="w-20" />
      </header>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {players.map((player) => {
          const isPlayerClueGiver = currentRound?.psychic_id === player.player_id;
          const isPlayerGuesser = currentRound?.guesser_id === player.player_id;
          return (
            <div
              key={player.id}
              className={cn(
                "glass-panel p-4 flex items-center gap-3",
                player.player_id === playerId && "neon-border"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isPlayerClueGiver 
                  ? "bg-secondary text-secondary-foreground" 
                  : isPlayerGuesser
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {isPlayerClueGiver ? (
                  <Eye className="w-5 h-5" />
                ) : isPlayerGuesser ? (
                  <Target className="w-5 h-5" />
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
                  <span>{isPlayerClueGiver ? "Clue Giver" : isPlayerGuesser ? "Guesser" : "Ready"}</span>
                </div>
              </div>
            </div>
          );
        })}
        
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

        {/* Clue Giving Phase */}
        {currentRound?.phase === "clue_giving" && (
          <div className="w-full max-w-2xl space-y-6 animate-slide-up">
            {isClueGiver ? (
              <>
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary-foreground">
                    <Eye className="w-5 h-5" />
                    <span className="font-display uppercase tracking-wider">You are giving the clue</span>
                  </span>
                </div>
                
                <SemicircleSpectrum
                  leftLabel={currentRound.left_extreme}
                  rightLabel={currentRound.right_extreme}
                  targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
                  showTarget={!targetHidden}
                />
                
                {!targetHidden ? (
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                      The colored zone shows where to aim. Give a clue that hints at this position!
                    </p>
                    <div className="text-center text-sm text-muted-foreground">
                      <span className="inline-block px-2 py-1 bg-red-500/20 rounded mr-2">Red = 30 pts</span>
                      <span className="inline-block px-2 py-1 bg-orange-500/20 rounded mr-2">Orange = 20 pts</span>
                      <span className="inline-block px-2 py-1 bg-yellow-500/20 rounded">Yellow = 10 pts</span>
                    </div>
                    <div className="flex gap-3">
                      <Input
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder="Enter your clue..."
                        maxLength={100}
                        onKeyDown={(e) => e.key === "Enter" && clue.trim() && handleSubmitClue()}
                        className="flex-1"
                      />
                      <Button
                        variant="neon"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim() || isLoading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={handleHideTarget}
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Target
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Target is hidden. Enter your clue:</p>
                    <div className="flex gap-3">
                      <Input
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder="Enter your clue..."
                        maxLength={100}
                        onKeyDown={(e) => e.key === "Enter" && clue.trim() && handleSubmitClue()}
                        className="flex-1"
                      />
                      <Button
                        variant="neon"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim() || isLoading}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-float">
                  <Eye className="w-16 h-16 mx-auto text-secondary" />
                </div>
                <p className="text-xl">The clue giver is viewing the target...</p>
                <p className="text-muted-foreground">Get ready to guess!</p>
              </div>
            )}
          </div>
        )}

        {/* Guessing Phase */}
        {currentRound?.phase === "guessing" && (
          <div className="w-full max-w-2xl space-y-6 animate-slide-up">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">The clue is:</p>
              <p className="text-3xl md:text-4xl font-display neon-text">
                "{currentRound.clue}"
              </p>
            </div>

            <SemicircleSpectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              needleAngle={needleAngle}
              onNeedleChange={setNeedleAngle}
              isDraggable={isGuesser}
            />

            {isGuesser ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Drag the needle to where you think the target is
                </p>
                <Button
                  variant="neon"
                  size="xl"
                  onClick={handleSubmitGuess}
                  disabled={isLoading}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lock In Guess
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Waiting for the guesser to make their guess...
              </p>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {currentRound?.phase === "reveal" && (
          <div className="w-full max-w-2xl space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Clue: "{currentRound.clue}"</p>
            </div>

            <SemicircleSpectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
              needleAngle={currentRound.guess_value !== null ? (currentRound.guess_value / 100) * 180 : 90}
              showReveal={true}
            />

            {/* Results */}
            <div className="glass-panel p-6 space-y-4 animate-reveal">
              {currentRound.points_awarded && currentRound.points_awarded > 0 ? (
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-8 h-8 text-warning" />
                  <span className="text-3xl font-display">
                    {currentRound.points_awarded === 30 ? "Bullseye!" : currentRound.points_awarded === 20 ? "Close!" : "Got it!"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-display text-muted-foreground">
                    Missed!
                  </span>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  variant="neon"
                  size="lg"
                  onClick={onNextRound}
                  disabled={isLoading}
                >
                  Next Round
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};