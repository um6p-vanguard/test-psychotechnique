'use client';

import { memo } from 'react';

import { cva } from 'class-variance-authority';
import { CheckCircle2, Lock } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { Game, GameStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameProgressBarProps {
  games: Pick<Game, 'id' | 'icon' | 'name'>[];
  gameStatuses: GameStatus[];
  currentGameIndex: number;
  onGameSelect?: (index: number) => void;
}

// Define styles for the game indicators using cva
const gameIndicatorStyles = cva(
  'flex items-center justify-center rounded-full border-2 transition-all duration-300',
  {
    variants: {
      status: {
        active: 'border-primary bg-primary text-primary-foreground scale-110 shadow-md',
        passed: 'border-green-600 bg-green-500 text-white hover:brightness-105 hover:scale-105',
        pending: 'border-border bg-muted text-muted-foreground',
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
    <div className="relative mx-auto mt-6 mb-12 max-w-4xl">
      <div className="relative h-28">
        {/* Progress bar */}
        <div className="absolute top-1/2 right-6 left-6 -translate-y-px">
          <Progress value={progressPercentage} className="bg-border h-0.5" />
        </div>

        {/* Game indicators container */}
        <div className="absolute inset-x-0 top-6">
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center justify-between px-4">
              {games.map((game, index) => {
                const status = gameStatuses[index];
                const isActive = status === 'active';
                const isPassed = status === 'passed';
                const isPending = status === 'pending';

                return (
                  <Tooltip key={game.id}>
                    <TooltipTrigger asChild>
                      <div className="flex w-24 flex-col items-center">
                        <div
                          aria-label={`${game.name} ${status}`}
                          className={cn(
                            gameIndicatorStyles({
                              status: status,
                              size: isActive ? 'large' : 'default',
                            }),
                            'mb-3 cursor-default',
                          )}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isPending ? (
                            <div className="flex items-center justify-center opacity-70">
                              <Lock className="h-4 w-4" />
                            </div>
                          ) : (
                            game.icon
                          )}
                        </div>

                        <span
                          className={cn(
                            'text-center text-xs font-medium transition-colors',
                            isActive ? 'text-primary' : 'text-muted-foreground',
                          )}
                        >
                          {game.name}
                        </span>
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
