'use client';

import { memo } from 'react';

import type { Level } from '@/lib/types';

import { GameInstructions } from './game-instructions';

interface LevelContentProps {
  level: Level;
  gameId: string;
  isPlaying: boolean;
}

export const LevelContent = memo(function LevelContent({
  level,
  gameId,
  isPlaying,
}: LevelContentProps) {
  return (
    <div className="space-y-4">
      <GameInstructions level={level} gameId={gameId} isPlaying={isPlaying} />
    </div>
  );
});
