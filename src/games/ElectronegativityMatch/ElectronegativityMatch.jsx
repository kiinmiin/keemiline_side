import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { electronegativityData } from './electronegativityData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './ElectronegativityMatch.module.css';

export function ElectronegativityMatch() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();
  const { t } = useLanguage();
  const {
    draggedItem,
    activeDropZone,
    registerDropZone,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useDragAndDrop();

  // Shuffle values once on mount
  const shuffledValues = useMemo(() => shuffleArray(electronegativityData.values), []);

  const [availableValues, setAvailableValues] = useState(shuffledValues);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleDropValue = useCallback(
    (valueId, elementId) => {
      if (matchedPairs[elementId]) return; // Already matched

      setAttempts((prev) => prev + 1);

      const value = electronegativityData.values.find((v) => v.id === valueId);
      const element = electronegativityData.elements.find((e) => e.id === elementId);

      if (!value || !element) return;

      const isCorrect = value.value === element.electronegativity;

      // Remove value from available
      setAvailableValues((prev) => prev.filter((v) => v.id !== valueId));

      // Add to matched pairs
      setMatchedPairs((prev) => {
        const newMatched = {
          ...prev,
          [elementId]: { value, isCorrect },
        };

        // Check if game is complete
        const matchedCount = Object.keys(newMatched).length;
        if (matchedCount >= electronegativityData.totalItems) {
          setTimeout(() => {
            completeGame(newMatched);
          }, 1500);
        }

        return newMatched;
      });

      if (isCorrect) {
        setFeedback({
          type: 'success',
          message: `${t('games.electronegativityMatch.correct')} ${element.symbol} = ${value.display}`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: `${t('games.electronegativityMatch.incorrect')} ${element.symbol} ${t('games.electronegativityMatch.actualValue')} ${element.electronegativity}`,
        });
      }

      setTimeout(() => setFeedback(null), 4000);
    },
    [matchedPairs, t]
  );

  const completeGame = (finalMatched) => {
    const correctCount = Object.values(finalMatched).filter((m) => m.isCorrect).length;
    const passed = correctCount >= electronegativityData.passingScore;

    updateProgress('electronegativityMatch', {
      score: correctCount,
      totalItems: electronegativityData.totalItems,
      passed,
    });

    setShowCompletion(true);
  };

  if (showCompletion) {
    const correctCount = Object.values(matchedPairs).filter((m) => m.isCorrect).length;
    const passed = correctCount >= electronegativityData.passingScore;

    return (
      <GameLayout title={t('games.electronegativityMatch.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {correctCount} / {electronegativityData.totalItems}
          </p>
          <p className={styles.attempts}>{t('games.electronegativityMatch.totalAttempts')}: {attempts}</p>
          {passed ? (
            <p className={styles.message}>{t('games.electronegativityMatch.successMessage')}</p>
          ) : (
            <p className={styles.message}>
              {t('games.electronegativityMatch.needToPass').replace('{score}', electronegativityData.passingScore)}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.electronegativityMatch.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.electronegativityMatch.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.electronegativityMatch.title')}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          {t('games.electronegativityMatch.instructions')}
          <br />
          <span className={styles.hint}>
            {t('games.electronegativityMatch.dragHint')}
          </span>
        </p>

        <div className={styles.progress}>
          {t('games.electronegativityMatch.matched')}: {Object.keys(matchedPairs).length} / {electronegativityData.totalItems}
        </div>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <div className={styles.gameArea}>
          <div className={styles.elementsSection}>
            <h3 className={styles.sectionTitle}>{t('games.electronegativityMatch.elements')}</h3>
            <div className={styles.elementsGrid}>
              {electronegativityData.elements.map((element) => {
                const matched = matchedPairs[element.id];
                return (
                  <div
                    key={element.id}
                    ref={(el) => registerDropZone(element.id, el, () => !matched)}
                    className={`${styles.elementCard} ${
                      matched ? (matched.isCorrect ? styles.correct : styles.incorrect) : ''
                    } ${
                      draggedItem && !matched && activeDropZone === element.id ? styles.activeDropZone : ''
                    }`}
                    onPointerUp={(e) => handleDragEnd(e, handleDropValue)}
                  >
                    <div className={styles.elementSymbol}>{element.symbol}</div>
                    <div className={styles.elementName}>{element.name}</div>
                    {matched && (
                      <div className={styles.matchedValue}>
                        {matched.value.display}
                        {matched.isCorrect ? ' ✓' : ` ✗ (${element.electronegativity})`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.valuesSection}>
            <h3 className={styles.sectionTitle}>{t('games.electronegativityMatch.values')}</h3>
            <div className={styles.valuesGrid}>
              {availableValues.map((value) => (
                <div
                  key={value.id}
                  className={`${styles.valueCard} ${draggedItem === value.id ? styles.dragging : ''}`}
                  onPointerDown={(e) => handleDragStart(value.id, e)}
                  onPointerMove={handleDragMove}
                  onPointerUp={(e) => handleDragEnd(e, handleDropValue)}
                  onPointerCancel={(e) => handleDragEnd(e, null)}
                >
                  {value.display}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
