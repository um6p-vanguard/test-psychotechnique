'use client';

import { useEffect, useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { GAMES_DATA } from '@/lib/data';
import type { Level } from '@/lib/types';

interface GameInstructionsProps {
  level: Level;
  gameId: string;
  isPlaying?: boolean;
}

interface GameInstruction {
  title: string;
  description: string;
  rules: string[];
}

const GAME_SPECIFIC_INSTRUCTIONS: Record<string, GameInstruction> = {};

GAMES_DATA.forEach((game) => {
  GAME_SPECIFIC_INSTRUCTIONS[game.id] = {
    title: game.name,
    description: game.description,
    rules: game.rules,
  };
});

export function GameInstructions({ level, gameId, isPlaying = false }: GameInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(!isPlaying);

  // Update expansion state whenever isPlaying changes
  useEffect(() => {
    setIsExpanded(!isPlaying);
  }, [isPlaying]);

  const gameInstructions = GAME_SPECIFIC_INSTRUCTIONS[gameId];

  if (!gameInstructions) return null;

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between px-4">
        <CardDescription>{gameInstructions.description}</CardDescription>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Level Instructions</div>
            <p className="text-sm text-gray-500">{level.content}</p>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Game Rules</div>
            <ul className="ml-5 list-disc space-y-1 text-sm text-gray-500">
              {gameInstructions.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-md bg-gray-100 p-3">
            <p className="text-sm text-gray-500">
              Read the instructions carefully before starting. Good luck!
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
