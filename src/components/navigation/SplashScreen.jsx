import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SplashScreen.module.css';

export function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.splash}>
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Keemiline</h1>
        <p className={styles.subtitle}>{t('navigation.splash.subtitle')}</p>

        <div className={styles.description}>
          <p>
            Master the fundamentals of chemical bonding with engaging mini-games
            that make learning chemistry fun and interactive.
          </p>
        </div>

        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/hub')}
        >
          {t('navigation.splash.startButton')}
        </Button>
      </div>
    </div>
  );
}
