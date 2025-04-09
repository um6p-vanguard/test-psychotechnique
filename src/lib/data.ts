import type { Game } from './types';

export const GAMES_DATA: Game[] = [
  {
    id: 'game-7',
    name: 'Memory Grid',
    icon: 'grid',
    levels: [
      {
        id: 'g7-l1',
        title: 'Level 1: Basic Pattern',
        content:
          'Memorize the pattern of 3 highlighted cells in a 4x4 grid, then recreate it by clicking on the same cells.',
      },
      {
        id: 'g7-l2',
        title: 'Level 2: Intermediate Pattern',
        content:
          'Memorize the pattern of 4 highlighted cells in a 5x5 grid. The cells will be shown for less time than in Level 1.',
      },
      {
        id: 'g7-l3',
        title: 'Level 3: Advanced Pattern',
        content:
          'Memorize the pattern of 5 highlighted cells in a 6x6 grid. The cells will be shown for an even shorter time.',
      },
      {
        id: 'g7-l4',
        title: 'Level 4: Expert Pattern',
        content:
          'Memorize the pattern of 7 highlighted cells in a 6x6 grid with minimal display time. Good luck!',
      },
    ],
  },
  {
    id: 'game-1',
    name: 'Memory Match',
    icon: 'brain',
    levels: [
      {
        id: 'g1-l1',
        title: 'Level 1',
        content: 'Memorize the pairs! Rules for Memory Match Level 1.',
      },
      {
        id: 'g1-l2',
        title: 'Level 2',
        content: 'More pairs to match. Rules for Memory Match Level 2.',
      },
      { id: 'g1-l3', title: 'Level 3', content: 'Final level! Rules for Memory Match Level 3.' },
    ],
  },
  {
    id: 'game-2',
    name: 'Sequence Order',
    icon: 'list-ordered',
    levels: [
      {
        id: 'g2-l1',
        title: 'Level 1',
        content: 'Repeat the sequence. Rules for Sequence Order Level 1.',
      },
      {
        id: 'g2-l2',
        title: 'Level 2',
        content: 'Longer sequence! Rules for Sequence Order Level 2.',
      },
      {
        id: 'g2-l3',
        title: 'Level 3',
        content: 'Reverse sequence. Rules for Sequence Order Level 3.',
      },
    ],
  },
  {
    id: 'game-3',
    name: 'Word Find',
    icon: 'search',
    levels: [
      {
        id: 'g3-l1',
        title: 'Level 1',
        content: 'Find the hidden words. Rules for Word Find Level 1.',
      },
      {
        id: 'g3-l2',
        title: 'Level 2',
        content: 'More words, harder grid. Rules for Word Find Level 2.',
      },
      { id: 'g3-l3', title: 'Level 3', content: 'Themed words. Rules for Word Find Level 3.' },
    ],
  },
  {
    id: 'game-4',
    name: 'Quick Math',
    icon: 'calculator',
    levels: [
      {
        id: 'g4-l1',
        title: 'Level 1',
        content: 'Solve basic addition. Rules for Quick Math Level 1.',
      },
      {
        id: 'g4-l2',
        title: 'Level 2',
        content: 'Addition and subtraction. Rules for Quick Math Level 2.',
      },
      { id: 'g4-l3', title: 'Level 3', content: 'Mixed operations. Rules for Quick Math Level 3.' },
    ],
  },
  {
    id: 'game-5',
    name: 'Logic Puzzle',
    icon: 'puzzle',
    levels: [
      {
        id: 'g5-l1',
        title: 'Level 1',
        content: 'Simple deduction. Rules for Logic Puzzle Level 1.',
      },
      {
        id: 'g5-l2',
        title: 'Level 2',
        content: 'More complex scenario. Rules for Logic Puzzle Level 2.',
      },
      {
        id: 'g5-l3',
        title: 'Level 3',
        content: 'Challenging deductions. Rules for Logic Puzzle Level 3.',
      },
    ],
  },
  {
    id: 'game-6',
    name: 'Typing Test',
    icon: 'keyboard',
    levels: [
      {
        id: 'g6-l1',
        title: 'Level 1',
        content: 'Type the sentence quickly. Rules for Typing Test Level 1.',
      },
      {
        id: 'g6-l2',
        title: 'Level 2',
        content: 'Longer paragraph. Rules for Typing Test Level 2.',
      },
      {
        id: 'g6-l3',
        title: 'Level 3',
        content: 'Complex text with symbols. Rules for Typing Test Level 3.',
      },
    ],
  },
];
