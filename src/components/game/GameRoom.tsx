import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SemicircleSpectrum } from "./SemicircleSpectrum";
import { GameHistory } from "./GameHistory";
import { GameState } from "@/lib/gameTypes";
import { useRoundHistory } from "@/hooks/useRoundHistory";
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
  Zap,
  Star,
  Flame,
  PartyPopper,
  Rocket
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
  onKickPlayer?: (playerIdToKick: string) => Promise<void>;
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
  onKickPlayer,
}) => {
  const { toast } = useToast();
  const { playSound } = useSoundEffects();
  const [clue, setClue] = useState("");
  const [needleAngle, setNeedleAngle] = useState(90);
  const [targetHidden, setTargetHidden] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showStarburst, setShowStarburst] = useState(false);
  const [showRocketTrails, setShowRocketTrails] = useState(false);
  const [phaseTransition, setPhaseTransition] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(0);
  const roundCountRef = useRef(0);
  const hasAutoStartedRef = useRef(false);
  
  const { room, players, currentRound, myPlayer } = gameState;
  const { rounds } = useRoundHistory(room?.id);
  
  // Track round count for auto-alternation
  useEffect(() => {
    if (currentRound?.round_number) {
      roundCountRef.current = currentRound.round_number;
    }
  }, [currentRound?.round_number]);
  
  // Reset targetHidden when round changes
  useEffect(() => {
    setTargetHidden(false);
    setNeedleAngle(90);
    hasAutoStartedRef.current = false;
  }, [currentRound?.id]);
  
  // Phase transition effect
  useEffect(() => {
    if (currentRound?.phase) {
      setPhaseTransition(true);
      setTimeout(() => setPhaseTransition(false), 600);
    }
  }, [currentRound?.phase]);
  
  // Play sound and show effects on phase changes
  useEffect(() => {
    if (currentRound?.phase === "reveal") {
      playSound("reveal");
      const points = currentRound.points_awarded || 0;
      
      if (points > 0) {
        setShowConfetti(true);
        setCelebrationLevel(points);
        
        if (points === 30) {
          // BULLSEYE - Maximum celebration!
          setShowFireworks(true);
          setShowStarburst(true);
          setShowRocketTrails(true);
          playSound("success");
        } else if (points === 20) {
          // Close - Good celebration
          setShowStarburst(true);
          playSound("sparkle");
        } else {
          playSound("sparkle");
        }
        
        setTimeout(() => {
          setShowConfetti(false);
          setShowFireworks(false);
          setShowStarburst(false);
          setShowRocketTrails(false);
          setCelebrationLevel(0);
        }, 3000);
      }
    } else if (currentRound?.phase === "guessing") {
      playSound("powerup");
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
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
  const is1v1 = players.length === 2;
  const hasPlayedBefore = roundCountRef.current > 0;

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
    if (!points || points === 0) return { text: "Missed!", color: "text-muted-foreground", icon: Target };
    if (points === 30) return { text: "BULLSEYE!", color: "text-success", icon: Flame };
    if (points === 20) return { text: "So Close!", color: "text-warning", icon: Star };
    return { text: "Nice!", color: "text-primary", icon: Sparkles };
  };

  // Auto-advance to next round after reveal, then auto-start for 1v1
  useEffect(() => {
    if (currentRound?.phase === "reveal") {
      const timer = setTimeout(() => {
        onNextRound();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentRound?.phase, onNextRound]);

  // Auto-start next round for 1v1 after first round
  useEffect(() => {
    if (is1v1 && hasPlayedBefore && isWaitingPhase && canStartRound && !hasAutoStartedRef.current && !isLoading) {
      hasAutoStartedRef.current = true;
      const timer = setTimeout(() => {
        playSound("whoosh");
        onStartRound();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [is1v1, hasPlayedBefore, isWaitingPhase, canStartRound, isLoading, onStartRound, playSound]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col p-4 md:p-6 overflow-hidden",
      phaseTransition && "animate-phase-flash"
    )}>
      {/* Confetti effect - Enhanced */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-explosion"
              style={{
                left: `${Math.random() * 100}%`,
                top: "50%",
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`,
              }}
            >
              <div 
                className={cn(
                  "rounded-sm",
                  i % 3 === 0 ? "w-4 h-4" : i % 2 === 0 ? "w-3 h-3" : "w-2 h-2"
                )}
                style={{
                  background: `hsl(${Math.random() * 360}, 90%, 60%)`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  boxShadow: `0 0 ${8 + Math.random() * 8}px hsl(${Math.random() * 360}, 90%, 60%)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Starburst effect */}
      {showStarburst && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="relative">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-starburst-ray"
                style={{
                  transform: `rotate(${i * 22.5}deg)`,
                  animationDelay: `${i * 0.03}s`,
                }}
              >
                <div 
                  className="w-1 h-40 bg-gradient-to-t from-transparent via-warning to-transparent opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rocket trails effect */}
      {showRocketTrails && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-rocket-launch"
              style={{
                left: `${10 + i * 15}%`,
                bottom: "-50px",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Rocket className="w-8 h-8 text-warning transform rotate-[-45deg]" />
              <div className="absolute top-4 left-4 w-2 h-16 bg-gradient-to-b from-warning via-accent to-transparent rounded-full opacity-70 animate-flame-flicker" />
            </div>
          ))}
        </div>
      )}

      {/* Fireworks effect for bullseye */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(8)].map((_, burstIndex) => (
            <div 
              key={burstIndex}
              className="absolute animate-firework-burst"
              style={{
                left: `${10 + burstIndex * 12}%`,
                top: `${20 + (burstIndex % 3) * 25}%`,
                animationDelay: `${burstIndex * 0.15}s`,
              }}
            >
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-firework-particle-enhanced"
                  style={{
                    background: `hsl(${(burstIndex * 45 + i * 22) % 360}, 95%, 60%)`,
                    boxShadow: `0 0 10px hsl(${(burstIndex * 45 + i * 22) % 360}, 95%, 60%)`,
                    transform: `rotate(${i * 22.5}deg)`,
                    animationDelay: `${burstIndex * 0.15}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Sparkle overlay for any celebration */}
      {celebrationLevel > 0 && (
        <div className="fixed inset-0 pointer-events-none z-45 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles 
                className={cn(
                  "text-warning",
                  i % 3 === 0 ? "w-6 h-6" : i % 2 === 0 ? "w-4 h-4" : "w-3 h-3"
                )}
                style={{ opacity: 0.6 + Math.random() * 0.4 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Ambient floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/50 animate-float-particle"
            style={{
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              left: `${5 + i * 8}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-slide-down relative z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLeaveRoom}
          className="game-button-ghost text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Leave
        </Button>
        
        <button
          onClick={copyRoomCode}
          className="game-card flex items-center gap-2 px-4 py-2.5 hover:border-primary/50 active:scale-95 transition-spring group"
        >
          <span className="text-lg font-bold tracking-widest group-hover:text-primary transition-colors">{room.code}</span>
          <Copy className="w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />
        </button>

        <div className="w-20" />
      </header>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        {players.map((player, index) => {
          const isPlayerClueGiver = currentRound?.psychic_id === player.player_id;
          const isPlayerGuesser = currentRound?.guesser_id === player.player_id;
          const isMe = player.player_id === playerId;
          return (
            <div
              key={player.id}
              className={cn(
                "game-card p-4 flex items-center gap-3 animate-slide-up relative overflow-hidden",
                isMe && "game-card-active",
                `stagger-${index + 1}`
              )}
            >
              {/* Active player glow effect */}
              {(isPlayerClueGiver || isPlayerGuesser) && (
                <div className={cn(
                  "absolute inset-0 opacity-20 animate-pulse-glow",
                  isPlayerClueGiver ? "bg-secondary" : "bg-primary"
                )} />
              )}
              
              <div className={cn(
                "icon-container w-10 h-10 rounded-xl transition-all duration-500 relative z-10",
                isPlayerClueGiver 
                  ? "icon-container-secondary animate-icon-bounce" 
                  : isPlayerGuesser
                  ? "icon-container-primary animate-icon-bounce"
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
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{player.name}</span>
                  {player.is_host && <Crown className="w-3.5 h-3.5 text-warning flex-shrink-0 animate-float" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    isPlayerClueGiver ? "text-secondary" : isPlayerGuesser ? "text-primary" : "text-muted-foreground"
                  )}>
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
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Waiting for players - Only show Start Round button on first round */}
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
            ) : is1v1 && hasPlayedBefore ? (
              // Auto-starting next round for 1v1
              <>
                <div className="icon-container icon-container-primary w-20 h-20 mx-auto rounded-3xl animate-spin-glow">
                  <Zap className="w-10 h-10 animate-pulse" />
                </div>
                <p className="text-xl font-semibold animate-pulse-soft">Switching roles...</p>
              </>
            ) : canStartRound ? (
              // First round - show start button
              <>
                <div className="icon-container icon-container-primary w-20 h-20 mx-auto rounded-3xl animate-pulse-glow">
                  <Zap className="w-10 h-10" />
                </div>
                <p className="text-xl font-semibold">Ready to play!</p>
                <Button
                  className="game-button h-14 px-10 text-base animate-button-ready"
                  onClick={handleStartRound}
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Game"}
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
          <div className={cn(
            "w-full max-w-md space-y-6",
            phaseTransition ? "animate-phase-enter" : "animate-slide-up"
          )}>
            {isClueGiver ? (
              <>
                <div className="text-center mb-4">
                  <span className="game-badge game-badge-secondary animate-badge-pulse">
                    <Eye className="w-3.5 h-3.5" />
                    You're giving the clue
                  </span>
                </div>
                
                <div className="animate-spectrum-reveal">
                  <SemicircleSpectrum
                    leftLabel={currentRound.left_extreme}
                    rightLabel={currentRound.right_extreme}
                    targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
                    showTarget={!targetHidden}
                  />
                </div>
                
                {!targetHidden ? (
                  <div className="space-y-4 animate-slide-up stagger-2">
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
                        className="game-button h-12 px-5 animate-button-ready"
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
                <div className="icon-container icon-container-secondary w-20 h-20 mx-auto rounded-3xl animate-thinking">
                  <Eye className="w-10 h-10" />
                </div>
                <p className="text-xl font-semibold">Waiting for clue...</p>
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guessing Phase */}
        {currentRound?.phase === "guessing" && (
          <div className={cn(
            "w-full max-w-md space-y-6",
            phaseTransition ? "animate-phase-enter" : "animate-slide-up"
          )}>
            <div className={cn(
              "text-center game-card p-4 animate-clue-reveal",
              pulseEffect && "animate-pulse-ring"
            )}>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">The clue is</p>
              <p className="text-2xl font-bold text-primary animate-text-glow">
                "{currentRound.clue}"
              </p>
            </div>

            <div className="animate-spectrum-reveal">
              <SemicircleSpectrum
                leftLabel={currentRound.left_extreme}
                rightLabel={currentRound.right_extreme}
                needleAngle={needleAngle}
                onNeedleChange={setNeedleAngle}
                isDraggable={isGuesser}
              />
            </div>

            {isGuesser ? (
              <div className="text-center space-y-4 animate-slide-up stagger-2">
                <p className="text-muted-foreground text-sm">
                  Drag the needle to where you think the target is
                </p>
                <Button
                  className="game-button h-14 px-10 text-base animate-button-ready"
                  onClick={handleSubmitGuess}
                  disabled={isLoading}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lock In Guess
                </Button>
              </div>
            ) : (
              <div className="text-center animate-pulse-soft">
                <p className="text-muted-foreground text-sm">
                  Waiting for the guesser...
                </p>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {currentRound?.phase === "reveal" && (
          <div className="w-full max-w-md space-y-6 animate-reveal-burst">
            <div className="text-center game-card p-3">
              <p className="text-sm text-muted-foreground">Clue: "{currentRound.clue}"</p>
            </div>

            <div className="animate-spectrum-reveal">
              <SemicircleSpectrum
                leftLabel={currentRound.left_extreme}
                rightLabel={currentRound.right_extreme}
                targetCenter={currentRound.target_center ? getTargetAngle(currentRound.target_center) : undefined}
                needleAngle={currentRound.guess_value !== null ? (currentRound.guess_value / 100) * 180 : 90}
                showReveal={true}
              />
            </div>

            {/* Results */}
            <div className="game-card p-6 text-center space-y-3 animate-result-pop relative overflow-hidden">
              {/* Background celebration for bullseye */}
              {currentRound.points_awarded === 30 && (
                <div className="absolute inset-0 bg-gradient-to-r from-success/10 via-success/20 to-success/10 animate-shimmer" />
              )}
              
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "icon-container w-14 h-14 rounded-2xl",
                    currentRound.points_awarded && currentRound.points_awarded > 0 
                      ? currentRound.points_awarded === 30 
                        ? "icon-container-success animate-icon-celebration"
                        : "icon-container-primary animate-wiggle" 
                      : "icon-container-muted animate-shake"
                  )}>
                    {React.createElement(getResultMessage(currentRound.points_awarded).icon, { 
                      className: "w-8 h-8" 
                    })}
                  </div>
                  <div className="text-left">
                    <span className={cn(
                      "text-3xl font-bold block animate-text-pop",
                      getResultMessage(currentRound.points_awarded).color
                    )}>
                      {getResultMessage(currentRound.points_awarded).text}
                    </span>
                    {showScores && currentRound.points_awarded && currentRound.points_awarded > 0 && (
                      <span className="text-primary font-semibold animate-fade-in stagger-1">
                        +{currentRound.points_awarded} points
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Auto-advance timer indicator */}
              <div className="pt-2 relative z-10">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-timer-bar rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2 animate-pulse-soft">
                  {is1v1 ? "Switching roles..." : "Next round starting..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game History - Show when rounds exist */}
      {rounds.length > 0 && (
        <div className="mt-6 relative z-10 animate-slide-up">
          <GameHistory rounds={rounds} />
        </div>
      )}
    </div>
  );
};
