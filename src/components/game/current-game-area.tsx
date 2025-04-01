'use client';

import { useState, useEffect, memo, useCallback, useRef } from 'react';
import type { Game } from '@/lib/types';
import { submitLevelAnswer } from '@/lib/api';
import { LevelContent } from './level-content';
import { ActionButtons } from './action-buttons';

interface CurrentGameAreaProps {
  game: Game;
  currentLevelIndex: number;
  onLevelComplete: (gameId: string, levelId: string, isGameFinished: boolean) => void;
}

export const CurrentGameArea = memo(function CurrentGameArea({
  game,
  currentLevelIndex,
  onLevelComplete,
}: CurrentGameAreaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  // Track if level has been submitted already to prevent multiple submissions
  const hasSubmittedRef = useRef(false);

  const currentLevel = game.levels[currentLevelIndex];
  const totalLevels = game.levels.length;
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === totalLevels - 1;

  const handleLevelSubmit = useCallback(
    async (finishGame: boolean): Promise<void> => {
      if (!currentLevel || hasSubmittedRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await submitLevelAnswer(game.id, currentLevel.id);

        if (response.success) {
          setIsCompleted(true);
          setIsPlaying(false);
          // Mark this level as submitted to prevent resubmission
          hasSubmittedRef.current = true;
          onLevelComplete(game.id, currentLevel.id, finishGame);
        } else {
          setError(response.error || 'Failed to submit answer. Please try again.');
        }
      } catch (err) {
        console.error('Error submitting level:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [currentLevel, game.id, onLevelComplete],
  );

  const handleStart = useCallback(async (): Promise<void> => {
    if (hasSubmittedRef.current) return;
    setIsPlaying(true);
    await handleLevelSubmit(false);
  }, [handleLevelSubmit]);

  const handleNext = useCallback(async (): Promise<void> => {
    if (hasSubmittedRef.current) return;
    await handleLevelSubmit(false);
  }, [handleLevelSubmit]);

  const handleFinish = useCallback(async (): Promise<void> => {
    if (hasSubmittedRef.current) return;
    await handleLevelSubmit(true);
  }, [handleLevelSubmit]);

  // Reset state when level changes
  useEffect(() => {
    setIsPlaying(false);
    setIsCompleted(false);
    setError(null);
    hasSubmittedRef.current = false;
  }, [currentLevel?.id]);

  if (!currentLevel) return <div>Error: Level data not found.</div>;

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
        isDisabled={hasSubmittedRef.current && isCompleted}
      />
    </div>
  );
});

// Also export as default for dynamic import
export default CurrentGameArea;
