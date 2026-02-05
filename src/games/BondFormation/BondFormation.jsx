import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { bondFormationData } from './bondFormationData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './BondFormation.module.css';

export function BondFormation() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();

  // Shuffle atoms once on mount
  const shuffledAtoms = useMemo(() => shuffleArray(bondFormationData.atoms), []);

  const [availableAtoms, setAvailableAtoms] = useState(shuffledAtoms);
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [formedBonds, setFormedBonds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleAtomClick = useCallback(
    (atomId) => {
      // If already selected, deselect
      if (selectedAtoms.includes(atomId)) {
        setSelectedAtoms(selectedAtoms.filter((id) => id !== atomId));
        return;
      }

      // If less than 2 selected, add to selection
      if (selectedAtoms.length < 2) {
        const newSelection = [...selectedAtoms, atomId];
        setSelectedAtoms(newSelection);

        // If we now have 2 atoms, check if they can bond
        if (newSelection.length === 2) {
          checkBond(newSelection);
        }
      }
    },
    [selectedAtoms]
  );

  const checkBond = useCallback(
    (atomIds) => {
      setAttempts(attempts + 1);

      // Find the matching pair
      const matchingPair = bondFormationData.pairs.find(
        (pair) =>
          (pair.atoms.includes(atomIds[0]) && pair.atoms.includes(atomIds[1])) &&
          atomIds[0] !== atomIds[1]
      );

      if (matchingPair) {
        // Correct match!
        const atom1 = bondFormationData.atoms.find((a) => a.id === atomIds[0]);
        const atom2 = bondFormationData.atoms.find((a) => a.id === atomIds[1]);

        setFeedback({
          type: 'success',
          message: `Correct! ${atom1.symbol} + ${atom2.symbol} → ${matchingPair.compound} (${matchingPair.name}). ${matchingPair.explanation}`,
        });

        // Remove atoms from available
        setAvailableAtoms((prev) =>
          prev.filter((atom) => !atomIds.includes(atom.id))
        );

        // Add to formed bonds
        setFormedBonds((prev) => [...prev, matchingPair]);

        // Check if game is complete
        if (formedBonds.length + 1 >= bondFormationData.totalPairs) {
          setTimeout(() => {
            completeGame(formedBonds.length + 1);
          }, 2000);
        }
      } else {
        // Incorrect match
        const atom1 = bondFormationData.atoms.find((a) => a.id === atomIds[0]);
        const atom2 = bondFormationData.atoms.find((a) => a.id === atomIds[1]);

        setFeedback({
          type: 'error',
          message: `${atom1.symbol} and ${atom2.symbol} don't form a stable bond in this exercise. Try different combinations!`,
        });
      }

      // Clear selection after a delay
      setTimeout(() => {
        setSelectedAtoms([]);
        setFeedback(null);
      }, 5000);
    },
    [attempts, formedBonds]
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
      <GameLayout title={bondFormationData.title}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className={styles.score}>
            Bonds Formed: {score} / {bondFormationData.totalPairs}
          </p>
          <p className={styles.attempts}>Total Attempts: {attempts}</p>
          {passed ? (
            <p className={styles.message}>{bondFormationData.successMessage}</p>
          ) : (
            <p className={styles.message}>
              You need at least {bondFormationData.passingScore} correct bonds to
              pass. Try again!
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Play Again
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              Back to Hub
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={bondFormationData.title}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          {bondFormationData.instructions}
          <br />
          <span className={styles.hint}>
            Select two atoms to try forming a bond
          </span>
        </p>

        <div className={styles.progress}>
          Bonds Formed: {formedBonds.length} / {bondFormationData.totalPairs}
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
            <h3 className={styles.sectionTitle}>Bonds You've Formed:</h3>
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
            Available Atoms
            {selectedAtoms.length > 0 && (
              <span className={styles.selectionCount}>
                ({selectedAtoms.length} selected)
              </span>
            )}
          </h3>
          <div className={styles.atomsGrid}>
            {availableAtoms.map((atom) => {
              const isSelected = selectedAtoms.includes(atom.id);
              return (
                <div
                  key={atom.id}
                  className={`${styles.atomCard} ${
                    isSelected ? styles.selected : ''
                  }`}
                  onClick={() => handleAtomClick(atom.id)}
                >
                  <div className={styles.atomSymbol}>{atom.symbol}</div>
                  <div className={styles.atomName}>{atom.name}</div>
                  <div className={styles.atomElectrons}>
                    {atom.electrons} valence e⁻
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
