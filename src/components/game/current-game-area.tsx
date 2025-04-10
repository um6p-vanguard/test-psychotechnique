'use client';

import { useCallback, useMemo, useState } from 'react';

import { submitLevelAnswer } from '@/lib/api';
import type { Game } from '@/lib/types';

import { ActionButtons } from './action-buttons';
import { GameInstructions } from './game-instructions';
import { GAME_COMPONENTS } from './games';

interface CurrentGameAreaProps {
  game: Game;
  currentLevelIndex: number;
}

export const CurrentGameArea = ({ game, currentLevelIndex }: CurrentGameAreaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(currentLevelIndex > 0);
  const [isPlaying, setIsPlaying] = useState(currentLevelIndex > 0);

  const GameComponent = useMemo(() => GAME_COMPONENTS[game.id], [game.id]);
  const currentLevel = game.levels[currentLevelIndex];
  const totalLevels = game.levels.length;
  const isFirstLevel = currentLevelIndex === 0;
  const isLastLevel = currentLevelIndex === totalLevels - 1;

  // Get the appropriate game component

  const handleLevelSubmit = useCallback(async (): Promise<void> => {
    if (!currentLevel) return;

    setIsLoading(true);
    setError(null);

    try {
      await submitLevelAnswer('test');
      // Immediately move to the next level or finish the game
      // without showing the completion state
    } catch (err) {
      console.error('Error submitting level:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentLevel, game.id]);

  const handleStart = useCallback(async (): Promise<void> => {
    setIsGameStarted(true);
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(async (): Promise<void> => {
    await handleLevelSubmit();
  }, [handleLevelSubmit]);

  if (!currentLevel) return <div>Error: Level data not found.</div>;

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <h2 className="mb-1 text-center text-2xl font-bold">{game.name}</h2>
      <p className="mb-4 text-center text-gray-500">
        Level {currentLevelIndex + 1} / {totalLevels}
      </p>

      {/* Always show level content/rules */}
      <GameInstructions level={currentLevel} gameId={game.id} isPlaying={isPlaying} />

      {/* Show game component only when playing */}
      {isPlaying && GameComponent && <GameComponent level={currentLevel} />}

      {error && (
        <div className="mb-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <ActionButtons
        isFirstLevel={isFirstLevel}
        isLastLevel={isLastLevel}
        isLoading={isLoading}
        isGameStarted={isGameStarted}
        onStart={handleStart}
        onNext={handleNext}
        onFinish={handleNext}
      />
    </div>
  );
};

// Also export as default for dynamic import
export default CurrentGameArea;
