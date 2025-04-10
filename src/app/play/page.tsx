import { CurrentGameArea } from '@/components/game/current-game-area';
import { GameProgressBar } from '@/components/game/game-progress-bar';

import { GAMES_DATA } from '@/lib/data';

const getProgress = () => {
  return {
    currentGame: GAMES_DATA[2],
    currentLevel: 0,
    currentGameIndex: 2,
  };
};

export default function PlayPage() {
  const { currentGame, currentLevel, currentGameIndex } = getProgress();

  return (
    <main className="container mx-auto px-4 py-8">
      <GameProgressBar currentGameIndex={currentGameIndex} />
      <CurrentGameArea game={currentGame} currentLevelIndex={currentLevel} />
    </main>
  );
}
