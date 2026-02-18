import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import styles from './GameHub.module.css';

const games = [
  {
    id: 'bondTypesSorting',
    titleKey: 'navigation.hub.bondTypesSorting',
    descriptionKey: 'navigation.hub.bondTypesSortingDesc',
    route: '/game/bond-types',
  },
  {
    id: 'bondFormation',
    titleKey: 'navigation.hub.bondFormation',
    descriptionKey: 'navigation.hub.bondFormationDesc',
    route: '/game/bond-formation',
  },
  {
    id: 'electronegativityMatch',
    titleKey: 'navigation.hub.electronegativityMatch',
    descriptionKey: 'navigation.hub.electronegativityMatchDesc',
    route: '/game/electronegativity',
  },
  {
    id: 'bondPolarityQuiz',
    titleKey: 'navigation.hub.bondPolarityQuiz',
    descriptionKey: 'navigation.hub.bondPolarityQuizDesc',
    route: '/game/bond-polarity',
  },
  {
    id: 'moleculeBuilder',
    titleKey: 'navigation.hub.moleculeBuilder',
    descriptionKey: 'navigation.hub.moleculeBuilderDesc',
    route: '/game/molecule-builder',
  },
];

export function GameHub() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { checkGameUnlocked, progress } = useProgress();

  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{t('navigation.hub.title')}</h1>
          <p className={styles.subtitle}>{t('navigation.hub.selectGame')}</p>
        </div>
        <LanguageSelector />
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
                  {t(game.titleKey)}
                  {!isUnlocked && ' 🔒'}
                  {isCompleted && ' ✓'}
                </h2>
                <p className={styles.gameDescription}>{t(game.descriptionKey)}</p>

                {gameProgress && isUnlocked && (
                  <div className={styles.stats}>
                    {t('navigation.hub.attemptsText')}  {gameProgress.attempts || 0}
                    {gameProgress.score !== undefined && (
                      <> • {t('navigation.hub.scoreText')} {gameProgress.score}/{gameProgress.totalItems}</>
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
                {isCompleted ? t('common.tryAgain') : isUnlocked ? t('navigation.hub.buttonTextPlay') : t('navigation.hub.buttonTextLocked')}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
