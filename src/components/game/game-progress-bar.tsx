'use client';

import { memo } from 'react';
import type { Game, GameStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Brain,
  ListOrdered,
  Search,
  Calculator,
  Puzzle,
  Keyboard,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cva } from 'class-variance-authority';

interface GameProgressBarProps {
  games: Pick<Game, 'id' | 'icon' | 'name'>[];
  gameStatuses: GameStatus[];
  currentGameIndex: number;
  onGameSelect?: (index: number) => void;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5" />,
  'list-ordered': <ListOrdered className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  calculator: <Calculator className="h-5 w-5" />,
  puzzle: <Puzzle className="h-5 w-5" />,
  keyboard: <Keyboard className="h-5 w-5" />,
};

// Define styles for the game indicators using cva
const gameIndicatorStyles = cva(
  'flex items-center justify-center rounded-full border-2 transition-all duration-300',
  {
    variants: {
      status: {
        active: 'border-primary bg-primary text-primary-foreground scale-110 shadow-md z-10',
        passed:
          'border-green-600 bg-green-500 text-white hover:brightness-105 hover:scale-105 z-10',
        pending: 'border-border bg-muted/60 text-muted-foreground z-10',
      },
      size: {
        default: 'h-12 w-12',
        large: 'h-14 w-14',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'default',
    },
  },
);

export const GameProgressBar = memo(function GameProgressBar({
  games,
  gameStatuses,
  currentGameIndex,
  onGameSelect,
}: GameProgressBarProps) {
  // Calculate progress percentage for the progress bar
  const progressPercentage =
    games.length <= 1 ? 100 : (currentGameIndex / (games.length - 1)) * 100;

  return (
    <div className="mt-6 mb-12">
      <div className="relative h-20">
        {/* Background track */}
        <div className="bg-muted/70 absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full"></div>

        {/* Progress indicator */}
        <div
          className="bg-primary absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Game indicators container */}
        <div className="absolute inset-0 flex items-center">
          <TooltipProvider delayDuration={300}>
            <div className="flex w-full justify-between px-4 md:px-10">
              {games.map((game, index) => {
                const status = gameStatuses[index];
                const isActive = status === 'active';
                const isPassed = status === 'passed';
                const isPending = status === 'pending';
                const isClickable = isActive;
                const gameIcon = game.icon && iconMap[game.icon] ? iconMap[game.icon] : index + 1;

                return (
                  <Tooltip key={game.id}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={
                            isClickable && onGameSelect ? () => onGameSelect(index) : undefined
                          }
                          disabled={!isClickable || !onGameSelect}
                          aria-label={`${game.name} ${status}`}
                          className={cn(
                            gameIndicatorStyles({
                              status: status,
                              size: isActive ? 'large' : 'default',
                            }),
                            isClickable && onGameSelect ? 'cursor-pointer' : 'cursor-not-allowed',
                          )}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isPending ? (
                            <div className="flex items-center justify-center opacity-70">
                              <Lock className="h-4 w-4" />
                            </div>
                          ) : (
                            gameIcon
                          )}
                        </button>

                        <div className="mt-2 flex h-6 items-center">
                          {(isActive || isPassed) && (
                            <span
                              className={cn(
                                'text-xs font-medium whitespace-nowrap transition-all duration-300',
                                isActive ? 'text-primary' : 'text-muted-foreground',
                              )}
                            >
                              {game.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-card text-card-foreground border shadow-md"
                    >
                      <div className="flex items-center gap-2 px-1">
                        <span className="font-medium">{game.name}</span>
                        <span className="text-xs opacity-80">
                          {isPassed ? '✓ Completed' : isActive ? '• Active' : '• Locked'}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
});
