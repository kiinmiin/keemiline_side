import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { bondFormationData } from './bondFormationData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './BondFormation.module.css';

export function BondFormation() {
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

  // Shuffle atoms once on mount
  const shuffledAtoms = useMemo(() => shuffleArray(bondFormationData.atoms), []);

  const [availableAtoms, setAvailableAtoms] = useState(shuffledAtoms);
  const [formedBonds, setFormedBonds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleDropAtom = useCallback(
    (atomId, targetAtomId) => {
      if (atomId === targetAtomId) return;

      setAttempts((prev) => prev + 1);

      // Find the matching pair
      const matchingPair = bondFormationData.pairs.find(
        (pair) =>
          (pair.atoms.includes(atomId) && pair.atoms.includes(targetAtomId)) &&
          atomId !== targetAtomId
      );

      if (matchingPair) {
        // Correct match!
        const atom1 = bondFormationData.atoms.find((a) => a.id === atomId);
        const atom2 = bondFormationData.atoms.find((a) => a.id === targetAtomId);

        setFeedback({
          type: 'success',
          message: `${t('games.bondFormation.correct')} ${atom1.symbol} + ${atom2.symbol} → ${matchingPair.compound} (${matchingPair.name})`,
        });

        // Remove atoms from available
        setAvailableAtoms((prev) =>
          prev.filter((atom) => ![atomId, targetAtomId].includes(atom.id))
        );

        // Add to formed bonds
        setFormedBonds((prev) => {
          const newBonds = [...prev, matchingPair];
          // Check if game is complete
          if (newBonds.length >= bondFormationData.totalPairs) {
            setTimeout(() => {
              completeGame(newBonds.length);
            }, 2000);
          }
          return newBonds;
        });
      } else {
        // Incorrect match
        const atom1 = bondFormationData.atoms.find((a) => a.id === atomId);
        const atom2 = bondFormationData.atoms.find((a) => a.id === targetAtomId);

        setFeedback({
          type: 'error',
          message: t('games.bondFormation.noBond')
            .replace('{atom1}', atom1.symbol)
            .replace('{atom2}', atom2.symbol),
        });
      }

      setTimeout(() => setFeedback(null), 5000);
    },
    [t]
  );

  const completeGame = (correctCount) => {
    const passed = correctCount >= bondFormationData.passingScore;

    updateProgress('bondFormation', {
      score: correctCount,
      totalItems: bondFormationData.totalPairs,
      passed,
    });

    setShowCompletion(true);
  };

  if (showCompletion) {
    const score = formedBonds.length;
    const passed = score >= bondFormationData.passingScore;

    return (
      <GameLayout title={t('games.bondFormation.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('games.bondFormation.bondsFormed')}: {score} / {bondFormationData.totalPairs}
          </p>
          <p className={styles.attempts}>{t('games.bondFormation.totalAttempts')}: {attempts}</p>
          {passed ? (
            <p className={styles.message}>{t('games.bondFormation.successMessage')}</p>
          ) : (
            <p className={styles.message}>
              {t('games.bondFormation.needToPass').replace('{score}', bondFormationData.passingScore)}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.bondFormation.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.bondFormation.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.bondFormation.title')}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          {t('games.bondFormation.instructions')}
          <br />
          <span className={styles.hint}>
            {t('games.bondFormation.dragHint')}
          </span>
        </p>

        <div className={styles.progress}>
          {t('games.bondFormation.bondsFormed')}: {formedBonds.length} / {bondFormationData.totalPairs}
        </div>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        {formedBonds.length > 0 && (
          <div className={styles.formedBonds}>
            <h3 className={styles.sectionTitle}>{t('games.bondFormation.bondsYouveFormed')}</h3>
            <div className={styles.bondsList}>
              {formedBonds.map((bond, index) => (
                <div key={index} className={styles.bondCard}>
                  <div className={styles.bondFormula}>{bond.compound}</div>
                  <div className={styles.bondName}>{bond.name}</div>
                  <div className={styles.bondType}>{bond.bondType}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.atomsSection}>
          <h3 className={styles.sectionTitle}>
            {t('games.bondFormation.availableAtoms')}
          </h3>
          <div className={styles.atomsGrid}>
            {availableAtoms.map((atom) => (
              <div
                key={atom.id}
                ref={(el) =>
                  registerDropZone(atom.id, el, () => true)
                }
                className={`${styles.atomCard} ${
                  draggedItem && draggedItem !== atom.id && activeDropZone === atom.id ? styles.activeDropZone : ''
                }`}
                onPointerDown={(e) => handleDragStart(atom.id, e)}
                onPointerMove={handleDragMove}
                onPointerUp={(e) => handleDragEnd(e, handleDropAtom)}
                onPointerCancel={(e) => handleDragEnd(e, null)}
              >
                <div className={styles.atomSymbol}>{atom.symbol}</div>
                <div className={styles.atomName}>{atom.name}</div>
                <div className={styles.atomElectrons}>
                  {atom.electrons} {t('games.bondFormation.valenceElectrons')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
