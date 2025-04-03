'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { Suspense } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { AlertTriangle } from 'lucide-react';

import { GameProgressBar } from '@/components/game/game-progress-bar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

import { GAMES_DATA } from '@/lib/data';
import type { GameStatus } from '@/lib/types';

// Dynamically import the CurrentGameArea to reduce initial load
const CurrentGameArea = dynamic(
  () =>
    import('@/components/game/current-game-area').then((mod) => ({ default: mod.CurrentGameArea })),
  {
    loading: () => <GameAreaSkeleton />,
    ssr: false,
  },
);

// Initialize game statuses: first game active, others pending
const initialGameStatuses: GameStatus[] = GAMES_DATA.map((_, index) =>
  index === 0 ? 'active' : 'pending',
);

function GameAreaSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="flex justify-center">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

function CompletionMessage() {
  const router = useRouter();

  return (
    <div className="space-y-6 py-10 text-center">
      <h2 className="text-2xl font-semibold text-green-600">Congratulations!</h2>
      <p className="text-muted-foreground mt-2">You have completed all the games!</p>
      <Button className="mt-4" onClick={() => router.push('/')}>
        Return to Home
      </Button>
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-md">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <p className="text-sm">Something went wrong loading the game content.</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-2 text-sm text-white underline hover:text-white/90"
        >
          Try again
        </button>
      </AlertDescription>
    </Alert>
  );
}

export default function PlayPage() {
  const [isPending, startTransition] = useTransition();
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

      startTransition(() => {
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
      });
    },
    [currentGame, currentGameIndex, currentLevelIndex],
  );

  const handleGameSelect = useCallback(
    (index: number) => {
      // Only allow selection of active games
      if (gameStatuses[index] === 'active') {
        startTransition(() => {
          setCurrentGameIndex(index);
          setCurrentLevelIndex(0); // Reset to the first level of the selected game
        });
      }
    },
    [gameStatuses],
  );

  // Prepare props for the progress bar (avoid passing full game objects)
  const progressBarGames = useMemo(
    () => GAMES_DATA.map(({ id, icon, name }) => ({ id, icon, name })),
    [],
  );

  const handleErrorReset = useCallback(() => {
    // Reset state to refresh the component if there was an error
    startTransition(() => {
      setCurrentLevelIndex(0);
    });
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <GameProgressBar
        games={progressBarGames}
        gameStatuses={gameStatuses}
        currentGameIndex={currentGameIndex}
        onGameSelect={handleGameSelect}
      />

      <Suspense fallback={<GameAreaSkeleton />}>
        {isPending ? (
          <GameAreaSkeleton />
        ) : currentGame ? (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
            <CurrentGameArea
              key={`game-${currentGame.id}`}
              game={currentGame}
              currentLevelIndex={currentLevelIndex}
              onLevelComplete={handleLevelComplete}
            />
          </ErrorBoundary>
        ) : (
          <CompletionMessage />
        )}
      </Suspense>
    </main>
  );
}
