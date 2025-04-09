'use client';

import { useEffect, useState } from 'react';

import { Brain, ChevronDown, ChevronUp, Clock, Gamepad2, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { Level } from '@/lib/types';

interface GameInstructionsProps {
  level: Level;
  gameId: string;
  isPlaying?: boolean;
}

const GAME_SPECIFIC_INSTRUCTIONS = {
  'game-1': {
    title: 'Memory Match',
    description: 'Test and improve your memory by matching pairs of cards',
    rules: [
      'Click on cards to reveal them',
      'Match pairs of identical cards',
      'Remember card positions',
      'Complete the level within the time limit',
    ],
  },
  'game-2': {
    title: 'Sequence Order',
    description: 'Remember and repeat sequences in the correct order',
    rules: [
      'Watch the sequence carefully',
      'Repeat the sequence in the same order',
      'Each level adds more complexity',
      'Complete within the given attempts',
    ],
  },
  'game-3': {
    title: 'Word Find',
    description: 'Find hidden words in a grid of letters',
    rules: [
      'Click and drag to select letters',
      'Words can be horizontal, vertical, or diagonal',
      'Find all words to complete the level',
      'Watch out for time limits',
    ],
  },
  'game-4': {
    title: 'Quick Math',
    description: 'Solve mathematical problems quickly and accurately',
    rules: [
      'Solve equations within time limit',
      'Type your answer using number keys',
      'Press Enter to submit',
      'Accuracy matters more than speed',
    ],
  },
  'game-5': {
    title: 'Logic Puzzle',
    description: 'Use deductive reasoning to solve puzzles',
    rules: [
      'Read all clues carefully',
      'Use process of elimination',
      'All answers are logical',
      'Take notes if needed',
    ],
  },
  'game-6': {
    title: 'Typing Test',
    description: 'Test your typing speed and accuracy',
    rules: [
      'Type exactly what you see',
      'Mind punctuation and capitalization',
      'Accuracy affects your score',
      'Complete within time limit',
    ],
  },
  'game-7': {
    title: 'Memory Grid',
    description: 'Test your spatial memory by remembering patterns in a grid',
    rules: [
      'Observe the highlighted cells carefully',
      'Remember their positions in the grid',
      'Recreate the pattern by clicking on the same cells',
      'Difficulty increases with each level',
    ],
  },
};

export function GameInstructions({ level, gameId, isPlaying = false }: GameInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(!isPlaying);

  // Update expansion state when isPlaying changes
  useEffect(() => {
    setIsExpanded(!isPlaying);
  }, [isPlaying]);

  const gameInstructions =
    GAME_SPECIFIC_INSTRUCTIONS[gameId as keyof typeof GAME_SPECIFIC_INSTRUCTIONS];

  if (!gameInstructions) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-primary h-5 w-5" />
            <CardTitle className="text-xl">{gameInstructions.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>{gameInstructions.description}</CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Info className="text-muted-foreground h-4 w-4" />
              Level Instructions
            </div>
            <p className="text-muted-foreground text-sm">{level.content}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Gamepad2 className="text-muted-foreground h-4 w-4" />
              Game Rules
            </div>
            <ul className="text-muted-foreground ml-5 list-disc space-y-1 text-sm">
              {gameInstructions.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="bg-muted mt-4 flex items-center gap-2 rounded-md p-3">
            <Clock className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-sm">
              Read the instructions carefully before starting. Good luck!
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
