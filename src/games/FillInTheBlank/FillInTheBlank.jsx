import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { shuffleArray } from '../../utils/shuffle';
import { fillInTheBlankData } from './fillInTheBlankData';
import styles from './FillInTheBlank.module.css';

export function FillInTheBlank() {
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

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [placements, setPlacements] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const isAdvancingRef = useRef(false);

  const currentExercise = fillInTheBlankData.exercises[currentExerciseIndex];
  const wordOptions = useMemo(
    () => shuffleArray(currentExercise.words),
    [currentExerciseIndex, currentExercise.words]
  );

  const usedWordIds = Object.values(placements);
  const blankIds = Object.keys(currentExercise.answers);

  const clearBlank = (blankId) => {
    setPlacements((current) => {
      if (!current[blankId]) return current;
      const next = { ...current };
      delete next[blankId];
      return next;
    });
  };

  const handleDropWord = (wordId, blankId) => {
    setPlacements((current) => {
      const next = { ...current };

      Object.keys(next).forEach((id) => {
        if (next[id] === wordId) {
          delete next[id];
        }
      });

      next[blankId] = wordId;
      return next;
    });
  };

  const goToNextExercise = (isCorrect) => {
    const nextResults = [...results, { id: currentExercise.id, isCorrect }];
    setResults(nextResults);

    if (currentExerciseIndex < fillInTheBlankData.exercises.length - 1) {
      setCurrentExerciseIndex((index) => index + 1);
      setPlacements({});
      setFeedback(null);
      isAdvancingRef.current = false;
      return;
    }

    const correctCount = nextResults.filter((result) => result.isCorrect).length;
    const passed = correctCount >= fillInTheBlankData.passingScore;

    updateProgress('fillInTheBlank', {
      score: correctCount,
      totalItems: fillInTheBlankData.totalItems,
      passed,
    });

    isAdvancingRef.current = false;
    setShowCompletion(true);
  };

  const evaluateExercise = () => {
    if (isAdvancingRef.current) return;

    const allFilled = blankIds.every((blankId) => placements[blankId]);

    if (!allFilled) {
      if (feedback?.type === 'error') {
        setFeedback(null);
      }
      return;
    }

    const isCorrect = blankIds.every(
      (blankId) => placements[blankId] === currentExercise.answers[blankId]
    );

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect
        ? t('games.fillInTheBlank.correct')
        : t('games.fillInTheBlank.notQuite'),
    });

    if (!isCorrect) {
      return;
    }

    isAdvancingRef.current = true;
    setTimeout(() => {
      goToNextExercise(true);
    }, 900);
  };

  useEffect(() => {
    if (showCompletion) return;
    evaluateExercise();
  }, [placements, currentExerciseIndex, showCompletion]);

  if (showCompletion) {
    const correctCount = results.filter((result) => result.isCorrect).length;
    const passed = correctCount >= fillInTheBlankData.passingScore;

    return (
      <GameLayout title={t('games.fillInTheBlank.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {correctCount} / {fillInTheBlankData.totalItems}
          </p>
          <p className={styles.message}>
            {passed
              ? t('games.fillInTheBlank.successMessage')
              : t('games.fillInTheBlank.needToPass').replace('{score}', fillInTheBlankData.passingScore)}
          </p>

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.fillInTheBlank.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.fillInTheBlank.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.fillInTheBlank.title')}>
      <div className={styles.game}>
        <p className={styles.progress}>
          {t('games.fillInTheBlank.progress')}: {currentExerciseIndex + 1} / {fillInTheBlankData.totalItems}
        </p>

        <p className={styles.instructions}>{t('games.fillInTheBlank.instructions')}</p>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <div className={styles.exerciseCard}>
          <div className={styles.sentence}>
            {currentExercise.parts.map((part) => {
              if (part.type === 'text') {
                return <span key={part.textKey}>{t(part.textKey)}</span>;
              }

              const placedWordId = placements[part.id];
              const placedWord = currentExercise.words.find((word) => word.id === placedWordId);

              return (
                <div
                  key={part.id}
                  ref={(el) => registerDropZone(part.id, el, () => true)}
                  className={`${styles.blank} ${placedWord ? styles.blankFilled : ''} ${draggedItem && activeDropZone === part.id ? styles.activeDropZone : ''}`}
                  onPointerUp={(e) => handleDragEnd(e, handleDropWord)}
                  onClick={() => clearBlank(part.id)}
                >
                  {placedWord ? t(placedWord.textKey) : t('games.fillInTheBlank.blankPlaceholder')}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wordBank}>
          {wordOptions.map((word) => {
            const isUsed = usedWordIds.includes(word.id);

            return (
              <div
                key={word.id}
                className={`${styles.wordButton} ${draggedItem === word.id ? styles.wordButtonSelected : ''} ${isUsed ? styles.wordButtonUsed : ''}`}
                onPointerDown={(e) => handleDragStart(word.id, e)}
                onPointerMove={handleDragMove}
                onPointerUp={(e) => handleDragEnd(e, handleDropWord)}
                onPointerCancel={(e) => handleDragEnd(e, null)}
              >
                {t(word.textKey)}
              </div>
            );
          })}
        </div>

      </div>
    </GameLayout>
  );
}
