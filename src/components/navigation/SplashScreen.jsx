import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import styles from './SplashScreen.module.css';

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.splash}>
      <div className={styles.content}>
        <h1 className={styles.title}>Keemiline</h1>
        <p className={styles.subtitle}>Learn Chemical Bonding Through Interactive Games</p>

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
          Start Learning
        </Button>
      </div>
    </div>
  );
}
