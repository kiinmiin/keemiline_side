import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { bondPolarityData } from './bondPolarityData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './BondPolarityQuiz.module.css';

export function BondPolarityQuiz() {
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

  // Shuffle bonds once on mount
  const shuffledBonds = useMemo(() => shuffleArray(bondPolarityData.bonds), []);

  const [availableBonds, setAvailableBonds] = useState(shuffledBonds);
  const [placedBonds, setPlacedBonds] = useState({
    polar: [],
    nonpolar: [],
  });
  const [feedback, setFeedback] = useState(null);
  const [bondStates, setBondStates] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);

  const validatePlacement = useCallback((bondId, categoryId) => {
    const bond = bondPolarityData.bonds.find((b) => b.id === bondId);
    const category = bondPolarityData.categories.find((c) => c.id === categoryId);

    if (!bond || !category) return false;

    return bond.isPolar === category.accepts;
  }, []);

  const handleDropBond = useCallback(
    (bondId, categoryId) => {
      const bond = availableBonds.find((b) => b.id === bondId);
      if (!bond) return;

      const isCorrect = validatePlacement(bondId, categoryId);

      // Remove from available bonds
      setAvailableBonds((prev) => prev.filter((b) => b.id !== bondId));

      // Add to placed bonds
      setPlacedBonds((prev) => ({
        ...prev,
        [categoryId]: [...prev[categoryId], { ...bond, categoryId }],
      }));

      // Set bond state
      setBondStates((prev) => ({
        ...prev,
        [bondId]: isCorrect ? 'correct' : 'incorrect',
      }));

      // Show feedback
      if (isCorrect) {
        setFeedback({
          type: 'success',
          message: `${t('games.bondPolarityQuiz.correct')} ${bond.explanation}`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: `${t('games.bondPolarityQuiz.notQuite')} ${bond.explanation}`,
        });
      }

      setTimeout(() => setFeedback(null), 5000);
    },
    [availableBonds, validatePlacement, t]
  );

  const checkCompletion = () => {
    const totalPlaced = Object.values(placedBonds).reduce(
      (sum, bonds) => sum + bonds.length,
      0
    );

    if (totalPlaced === bondPolarityData.totalItems) {
      const correctCount = Object.values(bondStates).filter(
        (state) => state === 'correct'
      ).length;

      const passed = correctCount >= bondPolarityData.passingScore;

      updateProgress('bondPolarityQuiz', {
        score: correctCount,
        totalItems: bondPolarityData.totalItems,
        passed,
      });

      setShowCompletion(true);
    }
  };

  // Auto-check completion when all bonds are placed
  useMemo(() => {
    const totalPlaced = Object.values(placedBonds).reduce(
      (sum, bonds) => sum + bonds.length,
      0
    );
    if (totalPlaced === bondPolarityData.totalItems && !showCompletion) {
      setTimeout(() => checkCompletion(), 1000);
    }
  }, [placedBonds]);

  if (showCompletion) {
    const correctCount = Object.values(bondStates).filter(
      (state) => state === 'correct'
    ).length;
    const passed = correctCount >= bondPolarityData.passingScore;

    return (
      <GameLayout title={t('games.bondPolarityQuiz.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {correctCount} / {bondPolarityData.totalItems}
          </p>
          {passed ? (
            <p className={styles.message}>{t('games.bondPolarityQuiz.successMessage')}</p>
          ) : (
            <p className={styles.message}>
              {t('games.bondPolarityQuiz.needToPass').replace('{score}', bondPolarityData.passingScore)}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.bondPolarityQuiz.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.bondPolarityQuiz.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.bondPolarityQuiz.title')}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          {t('games.bondPolarityQuiz.instructions')}
          <br />
          <span className={styles.hint}>
            {t('games.bondPolarityQuiz.dragHint')}
          </span>
        </p>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <div className={styles.categories}>
          {bondPolarityData.categories.map((category) => (
            <div
              key={category.id}
              ref={(el) => registerDropZone(category.id, el, () => true)}
              className={`${styles.category} ${
                draggedItem && activeDropZone === category.id ? styles.activeDropZone : ''
              }`}
              onPointerUp={(e) => handleDragEnd(e, handleDropBond)}
            >
              <h3 className={styles.categoryTitle}>
                {t(`games.bondPolarityQuiz.${category.id}`)}
              </h3>
              <div className={styles.categoryBonds}>
                {placedBonds[category.id].length === 0 ? (
                  <p className={styles.emptyMessage}>{t('games.bondPolarityQuiz.dropHere')}</p>
                ) : (
                  placedBonds[category.id].map((bond) => (
                    <Card
                      key={bond.id}
                      variant={bondStates[bond.id] === 'correct' ? 'success' : 'error'}
                    >
                      <div className={styles.bondCard}>
                        <span className={styles.bondFormula}>{bond.formula}</span>
                        <span className={styles.bondDiff}>ΔEN: {bond.electronegativityDiff}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.availableBonds}>
          <h3 className={styles.sectionTitle}>{t('games.bondPolarityQuiz.availableBonds')}</h3>
          <div className={styles.bondsGrid}>
            {availableBonds.map((bond) => (
              <div
                key={bond.id}
                className={`${styles.draggableBond} ${draggedItem === bond.id ? styles.dragging : ''}`}
                onPointerDown={(e) => handleDragStart(bond.id, e)}
                onPointerMove={handleDragMove}
                onPointerUp={(e) => handleDragEnd(e, handleDropBond)}
                onPointerCancel={(e) => handleDragEnd(e, null)}
              >
                <Card>
                  <div className={styles.bondCard}>
                    <span className={styles.bondFormula}>{bond.formula}</span>
                    <span className={styles.bondAtoms}>{bond.atoms.join(' + ')}</span>
                    <span className={styles.bondDiff}>ΔEN: {bond.electronegativityDiff}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
