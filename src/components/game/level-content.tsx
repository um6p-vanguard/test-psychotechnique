'use client';

import { memo } from 'react';
import type { Level } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LevelContentProps {
  level: Level;
  gameId: string;
  isPlaying: boolean;
  isCompleted: boolean;
}

export const LevelContent = memo(function LevelContent({
  level,
  isPlaying,
  isCompleted,
}: LevelContentProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{level.title}</CardTitle>
          <Badge
            variant={isCompleted ? 'success' : isPlaying ? 'default' : 'outline'}
            className={isCompleted ? 'bg-green-500 hover:bg-green-500' : ''}
          >
            {isCompleted ? 'Completed' : isPlaying ? 'In Progress' : 'Instructions'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mt-2">{level.content}</p>

        <div className="bg-muted/50 mt-4 rounded-md p-6">
          {isPlaying && !isCompleted ? (
            <div className="flex flex-col items-center">
              <p className="mb-3 text-center">Use the buttons below to continue.</p>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-center font-semibold text-green-600">Level Completed! ✓</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-3 text-center">
                Read the instructions above and click Start to begin.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
