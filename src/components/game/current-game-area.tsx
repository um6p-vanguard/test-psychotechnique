'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { submitLevelAnswer } from '@/lib/api';
import type { Game } from '@/lib/types';

import { ActionButtons } from './action-buttons';
import { GAME_COMPONENTS } from './games';
import { LevelContent } from './level-content';

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
  const [isGameStarted, setIsGameStarted] = useState(currentLevelIndex > 0);
  const [isPlaying, setIsPlaying] = useState(currentLevelIndex > 0);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasSubmittedRef = useRef(false);
  const prevLevelIndexRef = useRef<number>(currentLevelIndex);
  const prevGameIdRef = useRef<string>(game.id);

  const currentLevel = game.levels[currentLevelIndex];
  const totalLevels = game.levels.length;
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === totalLevels - 1;

  // Get the appropriate game component
  const GameComponent = GAME_COMPONENTS[game.id];

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
    setIsGameStarted(true);
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(async (): Promise<void> => {
    if (hasSubmittedRef.current) return;
    setIsGameStarted(true);
    await handleLevelSubmit(false);
  }, [handleLevelSubmit]);

  const handleFinish = useCallback(async (): Promise<void> => {
    if (hasSubmittedRef.current) return;
    setIsGameStarted(true);
    await handleLevelSubmit(true);
  }, [handleLevelSubmit]);

  // Handle level or game changes
  useEffect(() => {
    // Determine if we've changed game or level
    const gameChanged = prevGameIdRef.current !== game.id;
    const levelChanged = prevLevelIndexRef.current !== currentLevelIndex;

    if (gameChanged || levelChanged) {
      // Reset common state for any change
      setIsCompleted(false);
      setError(null);
      hasSubmittedRef.current = false;

      if (gameChanged) {
        // Game has changed - start fresh
        if (isFirstLevel) {
          // First level of new game needs manual start
          setIsGameStarted(false);
          setIsPlaying(false);
        } else {
          // Non-first level of any game should auto-start
          setIsGameStarted(true);
          setIsPlaying(true);
        }
      } else if (levelChanged && !gameChanged) {
        // Only the level changed within the same game
        if (currentLevelIndex > 0) {
          // Any non-first level should auto-play
          setIsGameStarted(true);
          setIsPlaying(true);
        }
      }

      // Update refs to current values
      prevGameIdRef.current = game.id;
      prevLevelIndexRef.current = currentLevelIndex;
    }
  }, [game.id, currentLevelIndex, isFirstLevel]);

  if (!currentLevel) return <div>Error: Level data not found.</div>;

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <h2 className="mb-1 text-center text-2xl font-bold">{game.name}</h2>
      <p className="text-muted-foreground mb-4 text-center">
        Level {currentLevelIndex + 1} / {totalLevels}
      </p>

      {/* Always show level content/rules */}
      <LevelContent
        level={currentLevel}
        gameId={game.id}
        isPlaying={isPlaying}
        isCompleted={isCompleted}
      />

      {/* Show game component only when playing */}
      {isPlaying && !isCompleted && GameComponent && (
        <div className="mb-6">
          <GameComponent level={currentLevel} onComplete={() => handleLevelSubmit(isLastLevel)} />
        </div>
      )}

      {error && (
        <div className="mb-4 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <ActionButtons
        isFirstLevel={isFirstLevel}
        isLastLevel={isLastLevel}
        isLoading={isLoading}
        isPlaying={isPlaying}
        isGameStarted={isGameStarted}
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
