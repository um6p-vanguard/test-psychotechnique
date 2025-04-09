'use client';

import { memo } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import type { Level } from '@/lib/types';

import { GameInstructions } from './game-instructions';

interface LevelContentProps {
  level: Level;
  gameId: string;
  isPlaying: boolean;
  isCompleted: boolean;
}

export const LevelContent = memo(function LevelContent({
  level,
  gameId,
  isPlaying,
  isCompleted,
}: LevelContentProps) {
  return (
    <div className="space-y-4">
      <GameInstructions level={level} gameId={gameId} isPlaying={isPlaying} />

      {isCompleted && (
        <Card>
          <CardContent className="border-success bg-success/10 p-6">
            <div className="flex flex-col items-center">
              <p className="text-success font-semibold">Level Completed! ✓</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
