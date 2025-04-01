'use client';

import type { Game, GameStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameProgressBarProps {
  games: Pick<Game, 'id' | 'icon' | 'name'>[];
  gameStatuses: GameStatus[];
  currentGameIndex: number;
  onGameSelect?: (index: number) => void;
}

export function GameProgressBar({
  games,
  gameStatuses,
  currentGameIndex,
  onGameSelect,
}: GameProgressBarProps) {
  return (
    <div className="relative mb-8 flex w-full items-center justify-between px-2 py-4 md:px-8">
      <div className="bg-muted absolute top-1/2 left-0 -z-10 h-1 w-full -translate-y-1/2"></div>
      <div
        className="bg-primary absolute top-1/2 left-0 -z-10 h-1 -translate-y-1/2 transition-all duration-500 ease-in-out"
        style={{
          width: `${(currentGameIndex / (games.length - 1)) * 100}%`,
        }}
      />
      {games.map((game, index) => {
        const status = gameStatuses[index];
        const isActive = status === 'active';
        const isPassed = status === 'passed';
        const isPending = status === 'pending';
        const isClickable = isPassed || isActive;

        return (
          <div key={game.id} className="relative z-10 flex flex-col items-center" title={game.name}>
            <button
              onClick={isClickable && onGameSelect ? () => onGameSelect(index) : undefined}
              disabled={!isClickable || !onGameSelect}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl transition-all duration-300 md:h-12 md:w-12 md:text-2xl',
                {
                  'bg-primary border-primary text-primary-foreground scale-110 shadow-lg': isActive,
                  'cursor-pointer border-green-600 bg-green-500 text-white hover:brightness-110':
                    isPassed,
                  'bg-muted border-border text-muted-foreground cursor-not-allowed': isPending,
                },
              )}
            >
              {isPassed ? '✔' : game.icon || index + 1}
            </button>
            {/* Optional: Show game name below icon */}
            {/* <span className="text-xs mt-1 text-center text-muted-foreground">{game.name}</span> */}
          </div>
        );
      })}
    </div>
  );
}
