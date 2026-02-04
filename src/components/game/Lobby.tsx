import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, ArrowRight, Shuffle, Loader2, X } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { cn } from "@/lib/utils";

interface LobbyProps {
  onCreateRoom: (name: string, isPrivate: boolean) => Promise<string | null>;
  onJoinRoom: (code: string, name: string, password?: string) => Promise<boolean>;
  isLoading: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading,
}) => {
  const { playSound } = useSoundEffects();
  const matchmaking = useMatchmaking();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [mode, setMode] = useState<"initial" | "create" | "join" | "matchmaking">("initial");
  const [isPrivate, setIsPrivate] = useState(false);

  // Handle matchmaking completion
  useEffect(() => {
    if (matchmaking.status === "matched" && matchmaking.roomCode && playerName.trim()) {
      playSound("success");
      onJoinRoom(matchmaking.roomCode, playerName.trim());
      matchmaking.reset();
    }
  }, [matchmaking.status, matchmaking.roomCode, playerName, onJoinRoom, playSound, matchmaking.reset]);

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    playSound("submit");
    const result = await onCreateRoom(playerName.trim(), isPrivate);
    if (result) playSound("success");
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    playSound("submit");
    const result = await onJoinRoom(roomCode.trim(), playerName.trim(), roomPassword.trim() || undefined);
    if (result) playSound("join");
    else playSound("error");
  };

  const handleModeChange = (newMode: "initial" | "create" | "join" | "matchmaking") => {
    playSound("pop");
    setMode(newMode);
    setRoomPassword("");
    if (newMode !== "matchmaking" && matchmaking.status === "searching") {
      matchmaking.cancelSearch();
    }
  };

  const handleStartMatchmaking = () => {
    if (!playerName.trim()) return;
    playSound("submit");
    matchmaking.startSearch(playerName.trim());
  };

  const handleCancelMatchmaking = () => {
    playSound("click");
    matchmaking.cancelSearch();
    handleModeChange("initial");
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-foreground tracking-tight">
          Wavelength
        </h1>

        {/* Main Panel */}
        <div className="game-card p-6 animate-slide-up stagger-1">
        {mode === "initial" && (
            <div className="space-y-3">
              <Button
                className="game-button w-full h-14 text-base"
                onClick={() => handleModeChange("create")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Room
              </Button>
              
              <Button
                className="game-button-ghost w-full h-14 text-base bg-muted"
                onClick={() => handleModeChange("join")}
              >
                <Users className="w-5 h-5 mr-2" />
                Join Room
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                    or
                  </span>
                </div>
              </div>

              <Button
                className="game-button-secondary w-full h-14 text-base"
                onClick={() => handleModeChange("matchmaking")}
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Find Random Opponent
              </Button>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  autoFocus
                  className="game-input h-12 text-base"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPrivate}
                  onClick={() => {
                    playSound("click");
                    setIsPrivate(!isPrivate);
                  }}
                  className={cn(
                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full",
                    "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-primary focus-visible:ring-offset-2",
                    isPrivate ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg",
                      "ring-0 transition-transform duration-300 mt-1",
                      isPrivate ? "translate-x-7" : "translate-x-1"
                    )}
                  />
                </button>
                <span className="text-sm font-medium">
                  Private Room
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  className="game-button-ghost flex-1 h-12"
                  onClick={() => handleModeChange("initial")}
                >
                  Back
                </Button>
                <Button
                  className="game-button flex-[2] h-12"
                  onClick={handleCreate}
                  disabled={!playerName.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  autoFocus
                  className="game-input h-12 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Room Code
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="XXXX"
                  maxLength={4}
                  className="game-input h-14 text-center text-2xl tracking-[0.4em] uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Password <span className="text-muted-foreground/50">(if private)</span>
                </label>
                <Input
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Enter password"
                  maxLength={4}
                  className="game-input h-12 text-center text-xl tracking-[0.3em] font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  className="game-button-ghost flex-1 h-12"
                  onClick={() => handleModeChange("initial")}
                >
                  Back
                </Button>
                <Button
                  className="game-button flex-[2] h-12"
                  onClick={handleJoin}
                  disabled={!playerName.trim() || !roomCode.trim() || isLoading}
                >
                  {isLoading ? "Joining..." : "Join"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {mode === "matchmaking" && (
            <div className="space-y-5 animate-slide-up">
              {matchmaking.status === "idle" || matchmaking.status === "error" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Your Name
                    </label>
                    <Input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={20}
                      autoFocus
                      className="game-input h-12 text-base"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="ghost"
                      className="game-button-ghost flex-1 h-12"
                      onClick={() => handleModeChange("initial")}
                    >
                      Back
                    </Button>
                    <Button
                      className="game-button-secondary flex-[2] h-12"
                      onClick={handleStartMatchmaking}
                      disabled={!playerName.trim()}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Find Match
                    </Button>
                  </div>
                </>
              ) : matchmaking.status === "searching" ? (
                <div className="text-center space-y-6 py-4">
                  <div className="relative mx-auto w-20 h-20">
                    <Loader2 className="w-20 h-20 text-secondary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shuffle className="w-8 h-8 text-secondary" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold mb-1">Searching for opponent...</p>
                    <p className="text-2xl font-bold text-secondary font-mono">
                      {formatElapsedTime(matchmaking.elapsedTime)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    className="game-button-ghost"
                    onClick={handleCancelMatchmaking}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
