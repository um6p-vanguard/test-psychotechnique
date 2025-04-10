'use client';

import { memo, useCallback, useState } from 'react';

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

  const currentLevel = game.levels[currentLevelIndex];
  const totalLevels = game.levels.length;
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === totalLevels - 1;

  // Get the appropriate game component
  const GameComponent = GAME_COMPONENTS[game.id];

  const handleLevelSubmit = useCallback(
    async (finishGame: boolean): Promise<void> => {
      if (!currentLevel) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await submitLevelAnswer(game.id, currentLevel.id);

        if (response.success) {
          // Immediately move to the next level or finish the game
          // without showing the completion state
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
    setIsGameStarted(true);
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(async (): Promise<void> => {
    await handleLevelSubmit(false);
  }, [handleLevelSubmit]);

  const handleFinish = useCallback(async (): Promise<void> => {
    await handleLevelSubmit(true);
  }, [handleLevelSubmit]);

  if (!currentLevel) return <div>Error: Level data not found.</div>;

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <h2 className="mb-1 text-center text-2xl font-bold">{game.name}</h2>
      <p className="mb-4 text-center text-gray-500">
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
          <p className="text-red-500">{error}</p>
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
        isDisabled={isCompleted}
      />
    </div>
  );
});

// Also export as default for dynamic import
export default CurrentGameArea;
