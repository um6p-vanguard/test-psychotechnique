import type { Level } from '@/lib/types';

export interface BaseGameProps {
  level: Level;
  onComplete: () => void;
}

export function BaseGame({ level }: BaseGameProps) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed p-8">
      <p className="text-muted-foreground text-center">Game content will be implemented here</p>
    </div>
  );
}
