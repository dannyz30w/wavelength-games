import React from "react";
import { Round } from "@/lib/gameTypes";
import { cn } from "@/lib/utils";
import { Trophy, Target, Flame, Star, Sparkles, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GameHistoryProps {
  rounds: Round[];
  className?: string;
}

export const GameHistory: React.FC<GameHistoryProps> = ({ rounds, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter to only completed rounds
  const completedRounds = rounds.filter(r => r.phase === "complete" || r.phase === "reveal");
  
  if (completedRounds.length === 0) return null;

  const getScoreInfo = (points: number | null) => {
    if (!points || points === 0) return { text: "Miss", color: "text-muted-foreground", bg: "bg-muted", icon: Target };
    if (points === 30) return { text: "Bullseye!", color: "text-success", bg: "bg-success/20", icon: Flame };
    if (points === 20) return { text: "Close!", color: "text-warning", bg: "bg-warning/20", icon: Star };
    return { text: "Nice!", color: "text-primary", bg: "bg-primary/20", icon: Sparkles };
  };

  const totalPoints = completedRounds.reduce((sum, r) => sum + (r.points_awarded || 0), 0);
  const bullseyes = completedRounds.filter(r => r.points_awarded === 30).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("game-card", className)}>
      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-2xl group">
        <div className="flex items-center gap-3">
          <div className="icon-container icon-container-primary w-10 h-10 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-sm">Round History</span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{completedRounds.length} rounds</span>
              <span className="text-primary font-medium">{totalPoints} pts</span>
              {bullseyes > 0 && (
                <span className="text-success font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {bullseyes}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {[...completedRounds].reverse().map((round, index) => {
            const scoreInfo = getScoreInfo(round.points_awarded);
            const Icon = scoreInfo.icon;
            
            return (
              <div
                key={round.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-muted/30 transition-all duration-300",
                  "hover:bg-muted/50 animate-slide-up"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                  scoreInfo.bg, scoreInfo.color
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{round.round_number}</span>
                    <span className="font-medium text-sm truncate">"{round.clue}"</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate max-w-[100px]">{round.left_extreme}</span>
                    <span className="text-primary">→</span>
                    <span className="truncate max-w-[100px]">{round.right_extreme}</span>
                  </div>
                </div>

                <div className={cn(
                  "text-right",
                  scoreInfo.color
                )}>
                  <span className="text-lg font-bold">+{round.points_awarded || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
