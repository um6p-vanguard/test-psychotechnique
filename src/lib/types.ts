export type GameStatus = 'pending' | 'active' | 'passed';

export interface Level {
  id: string;
  title: string; // e.g., "Level 1: The Basics"
  content: string; // Placeholder for rules/game area description
}

export interface Game {
  id: string;
  name: string;
  icon: React.ReactNode; // Placeholder for icon path or component identifier
  levels: Level[];
  description: string;
  rules: string[];
}

export interface AppState {
  games: Game[];
  currentGameIndex: number;
  currentLevelIndex: number; // Index within the *current* game's levels
  gameStatuses: GameStatus[];
}
