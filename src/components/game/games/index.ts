import type { BaseGameProps } from './base-game';
import { LogicPuzzle } from './logic-puzzle';
import { MemoryMatch } from './memory-match';
import { QuickMath } from './quick-math';
import { SequenceOrder } from './sequence-order';
import { TypingTest } from './typing-test';
import { WordFind } from './word-find';

export * from './base-game';
export * from './memory-match';
export * from './sequence-order';
export * from './word-find';
export * from './quick-math';
export * from './logic-puzzle';
export * from './typing-test';

// Map game IDs to their respective components
export const GAME_COMPONENTS: Record<string, React.ComponentType<BaseGameProps>> = {
  'game-1': MemoryMatch,
  'game-2': SequenceOrder,
  'game-3': WordFind,
  'game-4': QuickMath,
  'game-5': LogicPuzzle,
  'game-6': TypingTest,
};
