import type { Level } from '@/lib/types';

import { MemoryGrid } from './memory-grid';
import { QuickMath } from './quick-math';
import { SequenceOrder } from './sequence-order';
import { WordFind } from './word-find';

export * from './memory-grid';
export * from './sequence-order';
export * from './word-find';
export * from './quick-math';
export interface BaseGameProps {
  level: Level;
  onComplete: () => void;
}
// Map game IDs to their respective components
export const GAME_COMPONENTS: Record<string, React.ComponentType<BaseGameProps>> = {
  'game-1': MemoryGrid,
  'game-2': SequenceOrder,
  'game-3': WordFind,
  'game-4': QuickMath,
};
