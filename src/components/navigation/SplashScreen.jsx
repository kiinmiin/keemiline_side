import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import { buildSettingsShareUrl, getAppSettings, saveAppSettings } from '../../utils/appSettings';
import styles from './SplashScreen.module.css';

export function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => getAppSettings());

  const shareUrl = useMemo(() => buildSettingsShareUrl(settings), [settings]);

  const qrCodeUrl = useMemo(() => {
    const encodedPayload = encodeURIComponent(shareUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedPayload}`;
  }, [shareUrl]);

  const handleOpenSettings = () => {
    setSettings(getAppSettings());
    setIsSettingsOpen(true);
  };

  const handleLockStyleChange = (event) => {
    const nextLockStyle = event.target.value;
    setSettings((current) => ({
      ...current,
      lockStyle: nextLockStyle,
    }));
  };

  const handleSaveSettings = () => {
    saveAppSettings(settings);
    setIsSettingsOpen(false);
  };

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
            {t('navigation.splash.desc')}
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => navigate('/hub')}
          >
            {t('navigation.splash.startButton')}
          </Button>
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={handleOpenSettings}
          >
            {t('navigation.splash.generateButton')}
          </Button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={t('navigation.splash.settingsTitle')}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{t('navigation.splash.settingsTitle')}</h2>

            <div className={styles.settingField}>
              <label className={styles.settingLabel} htmlFor="lockStyle">
                {t('navigation.splash.lockStyleLabel')}
              </label>
              <select
                id="lockStyle"
                className={styles.settingSelect}
                value={settings.lockStyle}
                onChange={handleLockStyleChange}
              >
                <option value="strict">{t('navigation.splash.lockStyleStrict')}</option>
                <option value="lenient">{t('navigation.splash.lockStyleLenient')}</option>
                <option value="easy">{t('navigation.splash.lockStyleEasy')}</option>
              </select>
              <p className={styles.settingHelp}>
                {settings.lockStyle === 'strict'
                  ? t('navigation.splash.lockStyleStrictHelp')
                  : settings.lockStyle === 'easy'
                    ? t('navigation.splash.lockStyleEasyHelp')
                    : t('navigation.splash.lockStyleLenientHelp')}
              </p>
            </div>

            <div className={styles.qrSection}>
              <img
                src={qrCodeUrl}
                alt={t('navigation.splash.qrAlt')}
                className={styles.qrImage}
              />
            </div>

            <div className={styles.modalActions}>
              <Button variant="secondary" size="medium" onClick={() => setIsSettingsOpen(false)}>
                {t('navigation.splash.cancelButton')}
              </Button>
              <Button variant="primary" size="medium" onClick={handleSaveSettings}>
                {t('navigation.splash.saveButton')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
