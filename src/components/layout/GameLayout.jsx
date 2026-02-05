import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../common/LanguageSelector';
import styles from './GameLayout.module.css';

export function GameLayout({
  title,
  onBack,
  showProgress = false,
  currentStep,
  totalSteps,
  children,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/hub');
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.headerRight}>
          {showProgress && currentStep && totalSteps && (
            <div className={styles.progress}>
              {currentStep} / {totalSteps}
            </div>
          )}
          <LanguageSelector />
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
