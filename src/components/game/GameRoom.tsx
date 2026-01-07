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
  Zap,
  Copy,
  EyeOff
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
  
  const { room, players, currentRound, myPlayer } = gameState;
  
  // Play sound on phase changes
  useEffect(() => {
    if (currentRound?.phase === "reveal") {
      playSound("reveal");
    }
  }, [currentRound?.phase, playSound]);
  
  if (!room || !myPlayer) return null;

  const isClueGiver = currentRound?.psychic_id === playerId;
  const isGuesser = currentRound?.guesser_id === playerId;
  const canStartRound = players.length >= 2;
  const isWaitingPhase = !currentRound || currentRound.phase === "complete" || currentRound.phase === "waiting";

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    playSound("click");
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
    playSound("click");
    await onStartRound();
  };

  const handleNextRound = async () => {
    playSound("click");
    await onNextRound();
  };

  const getTargetAngle = (value: number) => (value / 100) * 180;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLeaveRoom}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave
        </Button>
        
        <button
          onClick={copyRoomCode}
          className="glass-card flex items-center gap-2 px-4 py-2.5 hover:bg-muted/30 transition-all active:scale-95"
        >
          <span className="text-lg font-bold tracking-widest">{room.code}</span>
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="w-20" />
      </header>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {players.map((player) => {
          const isPlayerClueGiver = currentRound?.psychic_id === player.player_id;
          const isPlayerGuesser = currentRound?.guesser_id === player.player_id;
          const isMe = player.player_id === playerId;
          return (
            <div
              key={player.id}
              className={cn(
                "glass-card p-4 flex items-center gap-3 transition-all",
                isMe && "ring-2 ring-primary/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isPlayerClueGiver 
                  ? "bg-gradient-to-br from-secondary to-accent" 
                  : isPlayerGuesser
                  ? "bg-gradient-to-br from-primary to-secondary"
                  : "bg-muted"
              )}>
                {isPlayerClueGiver ? (
                  <Eye className="w-5 h-5 text-white" />
                ) : isPlayerGuesser ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <Users className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{player.name}</span>
                  {player.is_host && <Crown className="w-3.5 h-3.5 text-warning flex-shrink-0" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isPlayerClueGiver ? "Clue Giver" : isPlayerGuesser ? "Guesser" : "Ready"}
                </div>
              </div>
            </div>
          );
        })}
        
        {players.length < 2 && (
          <div className="glass-card p-4 flex items-center justify-center border-dashed border-2 border-border/30">
            <span className="text-muted-foreground text-sm">Waiting...</span>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Waiting for players */}
        {isWaitingPhase && (
          <div className="text-center space-y-6 animate-fade-in">
            {players.length < 2 ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">
                    Waiting for another player
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share code: <span className="font-bold text-primary">{room.code}</span>
                  </p>
                </div>
              </>
            ) : canStartRound ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <p className="text-lg font-medium">Ready to play!</p>
                <Button
                  className="ios-button h-14 px-10 text-base"
                  onClick={handleStartRound}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Round"}
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-muted-foreground" />
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
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            {isClueGiver ? (
              <>
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full text-sm font-medium">
                    <Eye className="w-4 h-4" />
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
                  <div className="space-y-4">
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
                        className="flex-1 h-12 bg-input/50 border-border/50 rounded-xl"
                      />
                      <Button
                        className="ios-button h-12 px-5"
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
                        className="text-muted-foreground"
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Target
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground text-sm">Target hidden. Enter your clue:</p>
                    <div className="flex gap-2">
                      <Input
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder="Enter your clue..."
                        maxLength={100}
                        onKeyDown={(e) => e.key === "Enter" && clue.trim() && handleSubmitClue()}
                        className="flex-1 h-12 bg-input/50 border-border/50 rounded-xl"
                      />
                      <Button
                        className="ios-button h-12 px-5"
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
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center animate-pulse">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <p className="text-lg font-medium">Waiting for clue...</p>
                <p className="text-muted-foreground text-sm">Get ready to guess!</p>
              </div>
            )}
          </div>
        )}

        {/* Guessing Phase */}
        {currentRound?.phase === "guessing" && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="text-center glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">The clue is</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                <p className="text-muted-foreground text-sm">
                  Drag the needle to where you think the target is
                </p>
                <Button
                  className="ios-button h-14 px-10 text-base"
                  onClick={handleSubmitGuess}
                  disabled={isLoading}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lock In Guess
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm">
                Waiting for the guesser...
              </p>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {currentRound?.phase === "reveal" && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="text-center glass-card p-3">
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
            <div className="glass-card p-6 text-center space-y-4">
              {currentRound.points_awarded && currentRound.points_awarded > 0 ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-bold">
                    {currentRound.points_awarded === 30 ? "Bullseye!" : currentRound.points_awarded === 20 ? "Close!" : "Got it!"}
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-muted-foreground">
                  Missed!
                </p>
              )}

              <Button
                className="ios-button h-12 px-8"
                onClick={handleNextRound}
                disabled={isLoading}
              >
                Next Round
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
