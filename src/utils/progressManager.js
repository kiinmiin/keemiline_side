import { getAppSettings } from './appSettings';

/**
 * Game unlock conditions
 * true = always unlocked
 * string = unlock when that game is completed (e.g., 'bondTypesSorting')
 */
export const gameUnlockConditions = {
  fillInTheBlank: true,
  bondTypesSorting: true, // Always unlocked (first game)
  bondFormation: 'bondTypesSorting',
  electronegativityMatch: 'bondFormation',
  bondPolarityQuiz: 'electronegativityMatch',
  moleculeBuilder: 'bondPolarityQuiz',
  bondBasketCatcher: 'moleculeBuilder',
};

/**
 * Check if a game is unlocked based on progress
 * @param {string} gameId - ID of the game to check
 * @param {object} progress - Progress object from context
 * @returns {boolean} - Whether the game is unlocked
 */
export function isGameUnlocked(gameId, progress) {
  const { lockStyle } = getAppSettings();
  const condition = gameUnlockConditions[gameId];

  if (lockStyle === 'easy') {
    return true;
  }

  // Always unlocked
  if (condition === true) {
    return true;
  }

  // Check if prerequisite game is completed
  if (typeof condition === 'string') {
    const prerequisiteProgress = progress.games?.[condition];

    if (lockStyle === 'strict') {
      return prerequisiteProgress?.completed === true;
    }

    return (
      prerequisiteProgress?.completed === true ||
      (prerequisiteProgress?.failedAttempts ?? 0) >= 3
    );
  }

  return false;
}

/**
 * Get the next game to unlock
 * @param {string} currentGameId - ID of the current game
 * @returns {string|null} - ID of next game or null if none
 */
export function getNextGame(currentGameId) {
  const gameOrder = Object.keys(gameUnlockConditions);
  const currentIndex = gameOrder.indexOf(currentGameId);

  if (currentIndex === -1 || currentIndex === gameOrder.length - 1) {
    return null;
  }

  return gameOrder[currentIndex + 1];
}

/**
 * Initialize progress for a game
 * @param {string} gameId - ID of the game
 * @returns {object} - Initial progress object
 */
export function initializeGameProgress() {
  return {
    completed: false,
    score: 0,
    totalItems: 0,
    attempts: 0,
    failedAttempts: 0,
    lastPlayed: null,
  };
}

/**
 * Update progress after game completion
 * @param {object} currentProgress - Current progress object
 * @param {string} gameId - ID of the game
 * @param {object} results - Game results (score, totalItems, etc.)
 * @returns {object} - Updated progress object
 */
export function updateGameProgress(currentProgress, gameId, results) {
  const gameProgress = currentProgress.games?.[gameId] || initializeGameProgress();
  const passed = results.passed === true;

  return {
    ...currentProgress,
    games: {
      ...currentProgress.games,
      [gameId]: {
        ...gameProgress,
        completed: gameProgress.completed || passed,
        score: results.score,
        totalItems: results.totalItems,
        attempts: gameProgress.attempts + 1,
        failedAttempts: passed
          ? gameProgress.failedAttempts
          : (gameProgress.failedAttempts ?? 0) + 1,
        lastPlayed: new Date().toISOString(),
      },
    },
  };
}
