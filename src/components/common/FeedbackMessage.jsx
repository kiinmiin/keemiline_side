import { useEffect, useRef } from 'react';
import styles from './FeedbackMessage.module.css';

export function FeedbackMessage({
  type = 'info',
  message,
  onDismiss,
  autoHide = false,
  duration = 3000,
  autoScrollIntoView = true,
}) {
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  useEffect(() => {
    if (!autoScrollIntoView || !message || !feedbackRef.current) return;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const feedbackElement = feedbackRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rect = feedbackElement.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (isVisible) return;

    const header = document.querySelector('header');
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetY = window.scrollY + rect.top - headerHeight - 12;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [autoScrollIntoView, message]);

  if (!message) return null;

  const className = [styles.feedback, styles[type]].join(' ');

  return (
    <div className={className} role="alert" ref={feedbackRef}>
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
