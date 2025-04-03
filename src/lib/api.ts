// api.ts: Simulated API functions for game operations
import { createAbortController } from './utils';

// Shared type for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simulate API call delay with timeout capability
function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    // Setup abort handler
    if (signal) {
      // If signal is already aborted, clear timeout and reject immediately
      if (signal.aborted) {
        clearTimeout(timeout);
        return reject(new Error('Operation aborted'));
      }

      // Add listener to abort if signal is triggered later
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeout);
          reject(new Error('Operation aborted'));
        },
        { once: true },
      );
    }
  });
}

/**
 * Submit a level answer/completion
 * @param gameId - The ID of the game
 * @param levelId - The ID of the level being completed
 * @param timeoutMs - Optional timeout in milliseconds (defaults to 5000ms)
 * @returns Promise with submission result
 */
export async function submitLevelAnswer(
  gameId: string,
  levelId: string,
  timeoutMs = 5000,
): Promise<ApiResponse<void>> {
  const { signal, abort } = createAbortController();

  // Set a timeout to abort the request if it takes too long
  const timeoutId = setTimeout(() => {
    abort();
  }, timeoutMs);

  try {
    console.log(`Submitting answer for ${gameId}, ${levelId}...`);
    await wait(500, signal); // Simulate network latency

    // In a real app, you'd send data to your backend endpoint
    const success = Math.random() > 0.1; // Simulate occasional failure (10% chance)

    if (success) {
      console.log(`Answer submitted successfully for ${gameId}, ${levelId}.`);
      return { success: true };
    }

    console.error(`Failed to submit answer for ${gameId}, ${levelId}.`);
    return {
      success: false,
      // This is just an example error message - in a real app this would be the actual error from the server
      // error: 'Server rejected the answer. Please try again.',
      error:
        'This is just an example error message - in a real app this would be the actual error from the server',
    };
  } catch (error) {
    // Handle abort or other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error submitting answer: ${errorMessage}`);

    return {
      success: false,
      error:
        errorMessage === 'Operation aborted'
          ? 'Request timed out. Please try again.'
          : 'An unexpected error occurred. Please try again.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
