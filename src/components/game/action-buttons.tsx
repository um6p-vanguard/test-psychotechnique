'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, ArrowRight, CheckCircle } from 'lucide-react';

interface ActionButtonsProps {
  isFirstLevel: boolean;
  isLastLevel: boolean;
  isLoading: boolean;
  isDisabled?: boolean;
  onStart: () => Promise<void>;
  onNext: () => Promise<void>;
  onFinish: () => Promise<void>;
}

export const ActionButtons = memo(function ActionButtons({
  isFirstLevel,
  isLastLevel,
  isLoading,
  isDisabled = false,
  onStart,
  onNext,
  onFinish,
}: ActionButtonsProps) {
  // Determine which action to use based on level position
  const actionHandler = isFirstLevel ? onStart : isLastLevel ? onFinish : onNext;
  const buttonLabel = isFirstLevel ? 'Start' : isLastLevel ? 'Finish' : 'Next';
  const loadingLabel = isFirstLevel ? 'Starting...' : isLastLevel ? 'Finishing...' : 'Loading...';

  // Get the appropriate icon based on level position
  const getButtonIcon = () => {
    if (isFirstLevel) return <Play className="mr-2 h-4 w-4" />;

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
