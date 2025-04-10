'use client';

import type { BaseGameProps } from './index';

export function WordFind({ level, onComplete }: BaseGameProps) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed p-8">
      <p className="text-muted-foreground text-center">Word Find Game - {level.title}</p>
    </div>
  );
}
