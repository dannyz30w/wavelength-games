import React, { useState, useEffect } from "react";
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
  EyeOff,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";
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
  const { playSound } = useSoundEffects();
  const [clue, setClue] = useState("");
  const [needleAngle, setNeedleAngle] = useState(90);
  const [targetHidden, setTargetHidden] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { room, players, currentRound, myPlayer } = gameState;
  
  // Reset targetHidden when round changes
  useEffect(() => {
    setTargetHidden(false);
    setNeedleAngle(90);
  }, [currentRound?.id]);
  
  // Play sound and show effects on phase changes
  useEffect(() => {
    if (currentRound?.phase === "reveal") {
      playSound("reveal");
      if (currentRound.points_awarded && currentRound.points_awarded > 0) {
        setShowConfetti(true);
        playSound("success");
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } else if (currentRound?.phase === "guessing") {
      playSound("powerup");
    } else if (currentRound?.phase === "clue_giving") {
      playSound("magic");
    }
  }, [currentRound?.phase, currentRound?.points_awarded, playSound]);
  
  if (!room || !myPlayer) return null;

  const isClueGiver = currentRound?.psychic_id === playerId;
  const isGuesser = currentRound?.guesser_id === playerId;
  const canStartRound = players.length >= 2;
  const isWaitingPhase = !currentRound || currentRound.phase === "complete" || currentRound.phase === "waiting";
  const showScores = players.length > 2;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    playSound("pop");
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const handleSubmitClue = async () => {
    if (!clue.trim()) return;
    playSound("submit");
    await onSubmitClue(clue.trim());
    setClue("");
    setTargetHidden(true);
  };

  const handleSubmitGuess = async () => {
    playSound("submit");
    const guessValue = (needleAngle / 180) * 100;
    await onSubmitGuess(guessValue);
  };

  const handleHideTarget = () => {
    playSound("click");
    setTargetHidden(true);
  };

  const handleStartRound = async () => {
    playSound("ding");
    await onStartRound();
  };

  const handleNextRound = async () => {
    playSound("whoosh");
    await onNextRound();
  };

  const getTargetAngle = (value: number) => (value / 100) * 180;

  const getResultMessage = (points: number | null | undefined) => {
    if (!points || points === 0) return { text: "Missed!", color: "text-muted-foreground" };
    if (points === 30) return { text: "Bullseye!", color: "text-success" };
    if (points === 20) return { text: "So Close!", color: "text-warning" };
    return { text: "Nice!", color: "text-primary" };
  };

  // Auto-advance to next round after reveal
  useEffect(() => {
    if (currentRound?.phase === "reveal") {
      const timer = setTimeout(() => {
        onNextRound();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentRound?.phase, onNextRound]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      {/* Confetti effect - using particles instead of emojis */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "50%",
                animationDelay: `${Math.random() * 0.3}s`,
                background: `hsl(${Math.random() * 360}, 80%, 60%)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-slide-down">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLeaveRoom}
          className="game-button-ghost text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave
        </Button>
        
        <button
          onClick={copyRoomCode}
          className="game-card flex items-center gap-2 px-4 py-2.5 hover:border-primary/50 active:scale-95 transition-spring"
        >
          <span className="text-lg font-bold tracking-widest">{room.code}</span>
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-20" />
      </header>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {players.map((player, index) => {
          const isPlayerClueGiver = currentRound?.psychic_id === player.player_id;
          const isPlayerGuesser = currentRound?.guesser_id === player.player_id;
          const isMe = player.player_id === playerId;
          return (
            <div
              key={player.id}
              className={cn(
                "game-card p-4 flex items-center gap-3 animate-slide-up",
                isMe && "game-card-active",
                `stagger-${index + 1}`
              )}
            >
              <div className={cn(
                "icon-container w-10 h-10 rounded-xl transition-all duration-300",
                isPlayerClueGiver 
                  ? "icon-container-secondary animate-pop" 
                  : isPlayerGuesser
                  ? "icon-container-primary animate-pop"
                  : "icon-container-muted"
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
                  <span className="font-semibold text-sm truncate">{player.name}</span>
                  {player.is_host && <Crown className="w-3.5 h-3.5 text-warning flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isPlayerClueGiver ? "Clue Giver" : isPlayerGuesser ? "Guesser" : "Ready"}
                  </span>
                  {showScores && (
                    <span className="text-xs font-bold text-primary">{player.score} pts</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {players.length < 2 && (
          <div className="game-card p-4 flex items-center justify-center border-dashed border-2 border-border animate-pulse-soft">
            <span className="text-muted-foreground text-sm">Waiting...</span>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Waiting for players */}
        {isWaitingPhase && (
          <div className="text-center space-y-6 animate-bounce-in">
            {players.length < 2 ? (
              <>
                <div className="icon-container icon-container-muted w-20 h-20 mx-auto rounded-3xl animate-float">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">
                    Waiting for player
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share code: <span className="font-bold text-primary">{room.code}</span>
                  </p>
                </div>
              </>
            ) : canStartRound ? (
              <>
                <div className="icon-container icon-container-primary w-20 h-20 mx-auto rounded-3xl animate-pulse-soft">
                  <Zap className="w-10 h-10" />
                </div>
                <p className="text-xl font-semibold">Ready to play!</p>
                <Button
                  className="game-button h-14 px-10 text-base"
                  onClick={handleStartRound}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Round"}
                </Button>
              </>
            ) : (
              <>
                <div className="icon-container icon-container-muted w-20 h-20 mx-auto rounded-3xl animate-float">
                  <Zap className="w-10 h-10" />
                </div>
                <p className="text-lg text-muted-foreground">
                  Waiting for host to start...
                </p>
              </>
            )}
          </div>
        )}

        {/* Clue Giving Phase */}
        {currentRound?.phase === "clue_giving" && (
          <div className="w-full max-w-md space-y-6 animate-slide-up">
            {isClueGiver ? (
              <>
                <div className="text-center mb-4">
                  <span className="game-badge game-badge-secondary">
                    <Eye className="w-3.5 h-3.5" />
                    You're giving the clue
                  </span>
                </div>
                
                <SemicircleSpectrum
                  leftLabel={currentRound.left_extreme}
                  rightLabel={currentRound.right_extreme}
                  targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
                  showTarget={!targetHidden}
                />
                
                {!targetHidden ? (
                  <div className="space-y-4 animate-slide-up">
                    <p className="text-center text-muted-foreground text-sm">
                      Give a clue that hints at where the target is
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder="Enter your clue..."
                        maxLength={100}
                        onKeyDown={(e) => e.key === "Enter" && clue.trim() && handleSubmitClue()}
                        className="game-input flex-1 h-12"
                      />
                      <Button
                        className="game-button h-12 px-5"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim() || isLoading}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleHideTarget}
                        className="game-button-ghost text-muted-foreground"
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Target
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 animate-slide-up">
                    <p className="text-muted-foreground text-sm">Target hidden. Enter your clue:</p>
                    <div className="flex gap-2">
                      <Input
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder="Enter your clue..."
                        maxLength={100}
                        onKeyDown={(e) => e.key === "Enter" && clue.trim() && handleSubmitClue()}
                        className="game-input flex-1 h-12"
                      />
                      <Button
                        className="game-button h-12 px-5"
                        onClick={handleSubmitClue}
                        disabled={!clue.trim() || isLoading}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4 animate-bounce-in">
                <div className="icon-container icon-container-secondary w-20 h-20 mx-auto rounded-3xl animate-pulse-soft">
                  <Eye className="w-10 h-10" />
                </div>
                <p className="text-xl font-semibold">Waiting for clue...</p>
                <p className="text-muted-foreground text-sm">Get ready to guess!</p>
              </div>
            )}
          </div>
        )}

        {/* Guessing Phase */}
        {currentRound?.phase === "guessing" && (
          <div className="w-full max-w-md space-y-6 animate-slide-up">
            <div className="text-center game-card p-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">The clue is</p>
              <p className="text-2xl font-bold text-primary">
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
              <div className="text-center space-y-4 animate-slide-up">
                <p className="text-muted-foreground text-sm">
                  Drag the needle to where you think the target is
                </p>
                <Button
                  className="game-button h-14 px-10 text-base"
                  onClick={handleSubmitGuess}
                  disabled={isLoading}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lock In Guess
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm animate-pulse-soft">
                Waiting for the guesser...
              </p>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {currentRound?.phase === "reveal" && (
          <div className="w-full max-w-md space-y-6 animate-bounce-in">
            <div className="text-center game-card p-3">
              <p className="text-sm text-muted-foreground">Clue: "{currentRound.clue}"</p>
            </div>

            <SemicircleSpectrum
              leftLabel={currentRound.left_extreme}
              rightLabel={currentRound.right_extreme}
              targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
              needleAngle={currentRound.guess_value !== null ? (currentRound.guess_value / 100) * 180 : 90}
              showReveal={true}
            />

            {/* Results */}
            <div className="game-card p-6 text-center space-y-3 animate-pop">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "icon-container w-14 h-14 rounded-2xl animate-wiggle",
                    currentRound.points_awarded && currentRound.points_awarded > 0 
                      ? "icon-container-primary" 
                      : "icon-container-muted"
                  )}>
                    {currentRound.points_awarded && currentRound.points_awarded > 0 
                      ? <Trophy className="w-8 h-8" />
                      : <Target className="w-8 h-8" />
                    }
                  </div>
                  <div className="text-left">
                    <span className={cn(
                      "text-3xl font-bold block",
                      getResultMessage(currentRound.points_awarded).color
                    )}>
                      {getResultMessage(currentRound.points_awarded).text}
                    </span>
                    {showScores && currentRound.points_awarded && currentRound.points_awarded > 0 && (
                      <span className="text-primary font-semibold">
                        +{currentRound.points_awarded} points
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Auto-advance timer indicator */}
              <div className="pt-2">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-timer-bar" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Next round starting...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
