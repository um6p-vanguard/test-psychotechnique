import { Brain, Calculator, Puzzle, Search } from 'lucide-react';

import type { Game } from './types';

export const GAMES_DATA: Game[] = [
  {
    id: 'game-1',
    name: 'Memory Grid',
    icon: <Brain className="h-5 w-5" />,
    description: 'Test and improve your memory by matching pairs of cards',
    rules: [
      'Click on cards to reveal them',
      'Match pairs of identical cards',
      'Remember card positions',
      'Complete the level within the time limit',
    ],
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
    id: 'game-2',
    name: 'Sequence Order',
    icon: <Puzzle className="h-5 w-5" />,
    description: 'Remember and repeat sequences in the correct order',
    rules: [
      'Watch the sequence carefully',
      'Repeat the sequence in the same order',
      'Each level adds more complexity',
      'Complete within the given attempts',
    ],
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
    icon: <Search className="h-5 w-5" />,
    description: 'Find hidden words in a grid of letters',
    rules: [
      'Click and drag to select letters',
      'Words can be horizontal, vertical, or diagonal',
      'Find all words to complete the level',
      'Watch out for time limits',
    ],
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
    icon: <Calculator className="h-5 w-5" />,
    description: 'Solve mathematical problems quickly and accurately',
    rules: [
      'Solve equations within time limit',
      'Type your answer using number keys',
      'Press Enter to submit',
      'Accuracy matters more than speed',
    ],
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
];
