/**
 * Game unlock conditions
 * true = always unlocked
 * string = unlock when that game is completed (e.g., 'bondTypesSorting')
 */
export const gameUnlockConditions = {
  bondTypesSorting: true, // Always unlocked (first game)
  bondFormation: 'bondTypesSorting',
  electronegativityMatch: 'bondFormation',
  bondPolarityQuiz: 'electronegativityMatch',
  moleculeBuilder: 'bondPolarityQuiz',
  conceptQuestions: 'moleculeBuilder',
  atomicStructure: 'conceptQuestions',
  fillInTheBlank: 'atomicStructure',
};

/**
 * Check if a game is unlocked based on progress
 * @param {string} gameId - ID of the game to check
 * @param {object} progress - Progress object from context
 * @returns {boolean} - Whether the game is unlocked
 */
export function isGameUnlocked(gameId, progress) {
  const condition = gameUnlockConditions[gameId];

  // Always unlocked
  if (condition === true) {
    return true;
  }

  // Check if prerequisite game is completed
  if (typeof condition === 'string') {
    return progress.games?.[condition]?.completed === true;
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
export function initializeGameProgress(gameId) {
  return {
    completed: false,
    score: 0,
    totalItems: 0,
    attempts: 0,
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
  const gameProgress = currentProgress.games?.[gameId] || initializeGameProgress(gameId);

  return {
    ...currentProgress,
    games: {
      ...currentProgress.games,
      [gameId]: {
        ...gameProgress,
        completed: results.passed || false,
        score: results.score,
        totalItems: results.totalItems,
        attempts: gameProgress.attempts + 1,
        lastPlayed: new Date().toISOString(),
      },
    },
  };
}
