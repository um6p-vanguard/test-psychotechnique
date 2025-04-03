'use client';

import { memo } from 'react';

import { ArrowRight, CheckCircle, Loader2, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isFirstLevel: boolean;
  isLastLevel: boolean;
  isLoading: boolean;
  isDisabled?: boolean;
  isPlaying: boolean;
  isGameStarted: boolean;
  onStart: () => Promise<void>;
  onNext: () => Promise<void>;
  onFinish: () => Promise<void>;
}

export const ActionButtons = memo(function ActionButtons({
  isFirstLevel,
  isLastLevel,
  isLoading,
  isDisabled = false,
  isPlaying,
  isGameStarted,
  onStart,
  onNext,
  onFinish,
}: ActionButtonsProps) {
  // Show Start only for the first level and when game hasn't started
  // After game starts, show Next/Finish based on level position
  const actionHandler = !isGameStarted && isFirstLevel ? onStart : isLastLevel ? onFinish : onNext;
  const buttonLabel = !isGameStarted && isFirstLevel ? 'Start' : isLastLevel ? 'Finish' : 'Next';
  const loadingLabel =
    !isGameStarted && isFirstLevel ? 'Starting...' : isLastLevel ? 'Finishing...' : 'Loading...';

  // Get the appropriate icon based on the game state
  const getButtonIcon = () => {
    if (!isGameStarted && isFirstLevel) return <Play className="mr-2 h-4 w-4" />;
    if (isLastLevel) return <CheckCircle className="mr-2 h-4 w-4" />;
    return <ArrowRight className="mr-2 h-4 w-4" />;
  };

  return (
    <div className="mt-6 flex justify-center">
      <Button
        onClick={() => actionHandler()}
        disabled={isLoading || isDisabled}
        size="lg"
        variant={isLastLevel ? 'success' : 'default'}
        className="min-w-32 font-medium shadow-sm transition-all hover:shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            {getButtonIcon()}
            {buttonLabel}
          </>
        )}
      </Button>
    </div>
  );
});
