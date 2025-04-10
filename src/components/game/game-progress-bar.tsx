'use client';

import { memo } from 'react';

import { CheckCircle2, Lock } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

import { GAMES_DATA } from '@/lib/data';
import { cn } from '@/lib/utils';

interface GameProgressBarProps {
  currentGameIndex: number;
}

export const GameProgressBar = memo(function GameProgressBar({
  currentGameIndex,
}: GameProgressBarProps) {
  // Calculate progress percentage for the progress bar
  const progressPercentage =
    GAMES_DATA.length <= 1 ? 100 : (currentGameIndex / (GAMES_DATA.length - 1)) * 100;

  return (
    <div className="relative mx-auto mt-4 mb-8 max-w-4xl">
      <div className="relative h-24">
        {/* Progress bar */}
        <div className="absolute top-1/2 right-9 left-9 -translate-y-px">
          <Progress value={progressPercentage} className="h-0.5 bg-gray-200" />
        </div>

        {/* Game indicators container */}
        <div className="absolute inset-x-0 top-4">
          <div className="flex items-center justify-between px-4">
            {GAMES_DATA.map((game, index) => {
              const isActive = index === currentGameIndex;
              const isPassed = index < currentGameIndex;
              const isPending = index > currentGameIndex;

              return (
                <div key={game.id} className="flex w-24 flex-col items-center">
                  <div
                    aria-label={`${game.name}`}
                    className={cn(
                      'mb-2 flex h-15 w-15 items-center justify-center rounded-full border',
                      isActive && 'border-blue-500 bg-blue-500 text-white',
                      isPassed && 'border-green-500 bg-green-500 text-white',
                      isPending && 'border-gray-300 bg-gray-100 text-gray-400',
                    )}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isPending ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      game.icon
                    )}
                  </div>

                  <span
                    className={cn(
                      'text-center text-xs font-medium',
                      isActive ? 'text-blue-500' : 'text-gray-500',
                    )}
                  >
                    {game.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
