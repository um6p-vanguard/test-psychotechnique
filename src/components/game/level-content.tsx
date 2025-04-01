'use client';

import type { Level } from '@/lib/types';

interface LevelContentProps {
  level: Level;
  gameId: string;
  isPlaying: boolean;
  isCompleted: boolean;
}

export function LevelContent({ level, isPlaying, isCompleted }: LevelContentProps) {
  return (
    <div className="bg-card text-card-foreground mb-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{level.title}</h3>
        <div
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            isCompleted
              ? 'border-transparent bg-green-500 text-white'
              : isPlaying
                ? 'bg-primary text-primary-foreground border-transparent'
                : 'text-foreground'
          }`}
        >
          {isCompleted ? 'Completed' : isPlaying ? 'In Progress' : 'Instructions'}
        </div>
      </div>

      <p className="text-muted-foreground mt-2">{level.content}</p>

      <div className="bg-muted/50 mt-4 rounded-md p-6">
        {isPlaying && !isCompleted ? (
          <div className="flex flex-col items-center">
            <p className="mb-3 text-center">Use the buttons below to continue.</p>
          </div>
        ) : isCompleted ? (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-center font-semibold text-green-600">Level Completed! ✓</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-3 text-center">
              Read the instructions above and click Start to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
