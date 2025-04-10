'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

// Import CurrentGameArea directly instead of using dynamic imports
import { CurrentGameArea } from '@/components/game/current-game-area';
import { GameProgressBar } from '@/components/game/game-progress-bar';
import { Button } from '@/components/ui/button';

import { GAMES_DATA } from '@/lib/data';
import type { GameStatus } from '@/lib/types';

// Initialize game statuses: first game active, others pending
const initialGameStatuses: GameStatus[] = GAMES_DATA.map((_, index) =>
  index === 0 ? 'active' : 'pending',
);

function CompletionMessage() {
  const router = useRouter();

  return (
    <div className="space-y-6 py-10 text-center">
      <h2 className="text-2xl font-semibold text-green-600">Congratulations!</h2>
      <p className="mt-2 text-gray-500">You have completed all the games!</p>
      <Button className="mt-4" onClick={() => router.push('/')}>
        Return to Home
      </Button>
    </div>
  );
}

export default function PlayPage() {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameStatuses, setGameStatuses] = useState<GameStatus[]>(initialGameStatuses);

  const currentGame = useMemo(() => {
    if (currentGameIndex >= GAMES_DATA.length) return null; // All games completed
    return GAMES_DATA[currentGameIndex];
  }, [currentGameIndex]);

  const handleLevelComplete = useCallback(
    (_gameId: string, _levelId: string, isGameFinished: boolean) => {
      if (!currentGame) return;

      if (isGameFinished) {
        // --- Game Finished ---
        const nextGameIndex = currentGameIndex + 1;
        setGameStatuses((prev) => {
          const newStatuses = [...prev];
          newStatuses[currentGameIndex] = 'passed';

          if (nextGameIndex < GAMES_DATA.length) newStatuses[nextGameIndex] = 'active';

          return newStatuses;
        });

        setCurrentGameIndex(nextGameIndex);
        setCurrentLevelIndex(0); // Start at the first level of the new game
      } else {
        // --- Next Level within the same game ---
        const nextLevelIndex = currentLevelIndex + 1;
        if (nextLevelIndex < currentGame.levels.length) setCurrentLevelIndex(nextLevelIndex);
        else console.error('Attempted to move past the last level without finishing the game.');
      }
    },
    [currentGame, currentGameIndex, currentLevelIndex],
  );

  // Prepare props for the progress bar (avoid passing full game objects)
  const progressBarGames = useMemo(
    () => GAMES_DATA.map(({ id, icon, name }) => ({ id, icon, name })),
    [],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <GameProgressBar
        games={progressBarGames}
        gameStatuses={gameStatuses}
        currentGameIndex={currentGameIndex}
      />

      {currentGame ? (
        <CurrentGameArea
          key={`game-${currentGame.id}`}
          game={currentGame}
          currentLevelIndex={currentLevelIndex}
          onLevelComplete={handleLevelComplete}
        />
      ) : (
        <CompletionMessage />
      )}
    </main>
  );
}
