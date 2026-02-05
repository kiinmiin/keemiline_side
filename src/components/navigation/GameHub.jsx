import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { Button } from '../common/Button';
import styles from './GameHub.module.css';

const games = [
  {
    id: 'bondTypesSorting',
    title: 'Bond Types Sorting',
    description: 'Learn to distinguish between chemical bonds and intermolecular forces',
    route: '/game/bond-types',
  },
  {
    id: 'bondFormation',
    title: 'Bond Formation',
    description: 'Explore how atoms form chemical bonds',
    route: '/game/bond-formation',
  },
  {
    id: 'conceptQuestions',
    title: 'Concept Questions',
    description: 'Test your understanding of bonding concepts',
    route: '/game/concepts',
  },
  {
    id: 'atomicStructure',
    title: 'Atomic Structure',
    description: 'Learn about atoms and electron configurations',
    route: '/game/atomic-structure',
  },
  {
    id: 'fillInTheBlank',
    title: 'Fill in the Blank',
    description: 'Complete sentences about chemical bonding',
    route: '/game/fill-blank',
  },
];

export function GameHub() {
  const navigate = useNavigate();
  const { checkGameUnlocked, progress } = useProgress();

  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <h1 className={styles.title}>Game Hub</h1>
        <p className={styles.subtitle}>Choose a game to start learning</p>
      </header>

      <div className={styles.gameList}>
        {games.map((game) => {
          const isUnlocked = checkGameUnlocked(game.id);
          const gameProgress = progress.games?.[game.id];
          const isCompleted = gameProgress?.completed || false;

          return (
            <div
              key={game.id}
              className={`${styles.gameCard} ${!isUnlocked ? styles.locked : ''} ${
                isCompleted ? styles.completed : ''
              }`}
            >
              <div className={styles.gameInfo}>
                <h2 className={styles.gameTitle}>
                  {game.title}
                  {!isUnlocked && ' 🔒'}
                  {isCompleted && ' ✓'}
                </h2>
                <p className={styles.gameDescription}>{game.description}</p>

                {gameProgress && isUnlocked && (
                  <div className={styles.stats}>
                    Attempts: {gameProgress.attempts || 0}
                    {gameProgress.score !== undefined && (
                      <> • Score: {gameProgress.score}/{gameProgress.totalItems}</>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant={isCompleted ? 'success' : 'primary'}
                size="medium"
                onClick={() => navigate(game.route)}
                disabled={!isUnlocked}
              >
                {isCompleted ? 'Play Again' : isUnlocked ? 'Play' : 'Locked'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
