'use client';

import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isFirstLevel: boolean;
  isLastLevel: boolean;
  isLoading: boolean;
  onStart: () => Promise<void>;
  onNext: () => Promise<void>;
  onFinish: () => Promise<void>;
}

export function ActionButtons({
  isFirstLevel,
  isLastLevel,
  isLoading,
  onStart,
  onNext,
  onFinish,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex justify-center">
      {isFirstLevel ? (
        <Button onClick={() => onStart()} disabled={isLoading} className="px-8">
          {isLoading ? 'Starting...' : 'Start'}
        </Button>
      ) : isLastLevel ? (
        <Button onClick={() => onFinish()} disabled={isLoading} className="px-8">
          {isLoading ? 'Finishing...' : 'Finish'}
        </Button>
      ) : (
        <Button onClick={() => onNext()} disabled={isLoading} className="px-8">
          {isLoading ? 'Loading...' : 'Next'}
        </Button>
      )}
    </div>
  );
}
