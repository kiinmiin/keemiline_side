import { useEffect } from 'react';
import styles from './FeedbackMessage.module.css';

export function FeedbackMessage({
  type = 'info',
  message,
  onDismiss,
  autoHide = false,
  duration = 3000,
}) {
  useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  if (!message) return null;

  const className = [styles.feedback, styles[type]].join(' ');

  return (
    <div className={className} role="alert">
      <div className={styles.message}>{message}</div>
      {onDismiss && (
        <button
          className={styles.closeButton}
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ✕
        </button>
      )}
    </div>
  );
}
