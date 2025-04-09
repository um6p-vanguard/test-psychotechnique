// api.ts: Simulated API functions for game operations
import { createAbortController } from './utils';

// Shared type for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define game result types
export interface GameResult {
  gameId: string;
  levelId: string;
  timestamp: string;
  score: number;
  duration: number; // in milliseconds
  success: boolean;
  attempts: number;
  studentData?: Record<string, any>; // Additional game-specific data
}

// In-memory storage for results (in a real app, this would be a database)
const gameResults: GameResult[] = [];

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
 * @param gameData - Optional game-specific data to save
 * @param timeoutMs - Optional timeout in milliseconds (defaults to 5000ms)
 * @returns Promise with submission result
 */
export async function submitLevelAnswer(
  gameId: string,
  levelId: string,
  gameData?: Record<string, any>,
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

    // Create a game result entry
    const result: GameResult = {
      gameId,
      levelId,
      timestamp: new Date().toISOString(),
      score: gameData?.score || 100, // Default to 100 if no score provided
      duration: gameData?.duration || 0,
      success: true,
      attempts: gameData?.attempts || 1,
      studentData: gameData,
    };

    // Save the result (in memory for this demo)
    gameResults.push(result);
    console.log('Game results saved:', result);

    // In a real app, you'd send data to your backend endpoint
    const success = Math.random() > 0.1; // Simulate occasional failure (10% chance)

    if (success) {
      console.log(`Answer submitted successfully for ${gameId}, ${levelId}.`);
      return { success: true };
    }

    console.error(`Failed to submit answer for ${gameId}, ${levelId}.`);
    return {
      success: false,
      error: 'Server rejected the answer. Please try again.',
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

/**
 * Get all game results (for reporting/analytics)
 * @returns All saved game results
 */
export function getGameResults(): GameResult[] {
  return [...gameResults]; // Return a copy to prevent mutation
}

/**
 * Get results for a specific student
 * @param studentId - Student identifier
 * @returns Game results for the specified student
 */
export function getStudentResults(studentId: string): GameResult[] {
  return gameResults.filter((result) => result.studentData?.studentId === studentId);
}
