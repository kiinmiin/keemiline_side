import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { language, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <div className={styles.selector}>
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          className={`${styles.button} ${language === lang ? styles.active : ''}`}
          onClick={() => changeLanguage(lang)}
          aria-pressed={language === lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
