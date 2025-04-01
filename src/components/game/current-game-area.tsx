'use client';

import { useState, useEffect } from 'react';
import type { Game } from '@/lib/types';
import { submitLevelAnswer } from '@/lib/api';
import { LevelContent } from './level-content';
import { ActionButtons } from './action-buttons';

interface CurrentGameAreaProps {
  game: Game;
  currentLevelIndex: number;
  onLevelComplete: (gameId: string, levelId: string, isGameFinished: boolean) => void;
}

export function CurrentGameArea({
  game,
  currentLevelIndex,
  onLevelComplete,
}: CurrentGameAreaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentLevel = game.levels[currentLevelIndex];
  const totalLevels = game.levels.length;
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === totalLevels - 1;

  async function handleLevelSubmit(finishGame: boolean): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitLevelAnswer(game.id, currentLevel.id);
      if (result.success) {
        setIsCompleted(true);
        setIsPlaying(false);
        onLevelComplete(game.id, currentLevel.id, finishGame);
      } else setError('Failed to submit answer. Please try again.');
    } catch (err) {
      console.error('Error submitting level:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
  }

  async function handleStart(): Promise<void> {
    // Just advance to next level immediately
    await handleLevelSubmit(false);
  }

  async function handleNext(): Promise<void> {
    await handleLevelSubmit(false);
  }

  async function handleFinish(): Promise<void> {
    await handleLevelSubmit(true);
  }

  // Reset state when level changes
  useEffect(() => {
    setIsPlaying(false);
    setIsCompleted(false);
    setError(null);
  }, [currentLevel.id]);

  if (!currentLevel) {
    // Should not happen with correct state management, but good practice
    return <div>Error: Level data not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <h2 className="mb-1 text-center text-2xl font-bold">{game.name}</h2>
      <p className="text-muted-foreground mb-4 text-center">
        Level {currentLevelIndex + 1} / {totalLevels}
      </p>

      <LevelContent
        level={currentLevel}
        gameId={game.id}
        isPlaying={isPlaying}
        isCompleted={isCompleted}
      />

      {error && <p className="text-destructive mb-4 text-center">{error}</p>}

      <ActionButtons
        isFirstLevel={isFirstLevel}
        isLastLevel={isLastLevel}
        isLoading={isLoading}
        onStart={handleStart}
        onNext={handleNext}
        onFinish={handleFinish}
      />
    </div>
  );
}
