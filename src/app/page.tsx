'use client';

import { useState, useMemo, useCallback } from 'react';
import { GAMES_DATA } from '@/lib/data';
import type { GameStatus } from '@/lib/types';
import { GameProgressBar } from '@/components/game/game-progress-bar';
import { CurrentGameArea } from '@/components/game/current-game-area';

// Initialize game statuses: first game active, others pending
const initialGameStatuses: GameStatus[] = GAMES_DATA.map((_, index) =>
  index === 0 ? 'active' : 'pending',
);

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
        const newStatuses = [...gameStatuses];
        newStatuses[currentGameIndex] = 'passed';

        if (nextGameIndex < GAMES_DATA.length) {
          // Move to the next game
          newStatuses[nextGameIndex] = 'active';
          setGameStatuses(newStatuses);
          setCurrentGameIndex(nextGameIndex);
          setCurrentLevelIndex(0); // Start at the first level of the new game
        } else {
          // --- All Games Completed ---
          setGameStatuses(newStatuses); // Mark the last game as passed
          setCurrentGameIndex(nextGameIndex); // Go beyond the last index to signify completion
          console.log('Congratulations! All games completed!');
          // You might want to redirect or show a completion message here
        }
      } else {
        // --- Next Level within the same game ---
        const nextLevelIndex = currentLevelIndex + 1;
        if (nextLevelIndex < currentGame.levels.length) {
          setCurrentLevelIndex(nextLevelIndex);
        } else {
          // This case should theoretically be handled by isGameFinished=true
          // but as a fallback, we can log an error.
          console.error('Attempted to move past the last level without finishing the game.');
        }
      }
    },
    [currentGame, currentGameIndex, currentLevelIndex, gameStatuses],
  );

  const handleGameSelect = useCallback(
    (index: number) => {
      // Only allow selection of active or passed games
      if (gameStatuses[index] === 'active' || gameStatuses[index] === 'passed') {
        setCurrentGameIndex(index);
        setCurrentLevelIndex(0); // Reset to the first level of the selected game
      }
    },
    [gameStatuses],
  );

  // Prepare props for the progress bar (avoid passing full game objects)
  const progressBarGames = useMemo(
    () => GAMES_DATA.map(({ id, icon, name }) => ({ id, icon, name })),
    [],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Game Progress</h1>

      <GameProgressBar
        games={progressBarGames}
        gameStatuses={gameStatuses}
        currentGameIndex={currentGameIndex}
        onGameSelect={handleGameSelect}
      />

      {currentGame ? (
        <CurrentGameArea
          game={currentGame}
          currentLevelIndex={currentLevelIndex}
          onLevelComplete={handleLevelComplete}
        />
      ) : (
        <div className="py-10 text-center">
          <h2 className="text-2xl font-semibold text-green-600">Congratulations!</h2>
          <p className="text-muted-foreground mt-2">You have completed all the games!</p>
          {/* Optional: Add a button to restart or go elsewhere */}
        </div>
      )}
    </main>
  );
}
