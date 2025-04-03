'use client';

import type { BaseGameProps } from './base-game';

export function LogicPuzzle({ level, onComplete }: BaseGameProps) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed p-8">
      <p className="text-muted-foreground text-center">Logic Puzzle Game - {level.title}</p>
    </div>
  );
}
