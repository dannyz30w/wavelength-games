import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, ArrowRight, Zap } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";

interface LobbyProps {
  onCreateRoom: (name: string, isPrivate: boolean) => Promise<string | null>;
  onJoinRoom: (code: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading,
}) => {
  const { playSound } = useSoundEffects();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    playSound("submit");
    const result = await onCreateRoom(playerName.trim(), isPrivate);
    if (result) playSound("success");
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    playSound("submit");
    const result = await onJoinRoom(roomCode.trim(), playerName.trim());
    if (result) playSound("join");
    else playSound("error");
  };

  const handleModeChange = (newMode: "initial" | "create" | "join") => {
    playSound("pop");
    setMode(newMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10 animate-bounce-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="icon-container icon-container-primary w-14 h-14 rounded-2xl">
              <Zap className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Wavelength
          </h1>
        </div>

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
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-6 animate-slide-up stagger-2 font-medium">
          A mind-reading game for 2+ players
        </p>
      </div>
    </div>
  );
};
