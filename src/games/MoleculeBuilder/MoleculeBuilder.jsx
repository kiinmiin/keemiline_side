import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { moleculeBuilderData } from './moleculeBuilderData';
import styles from './MoleculeBuilder.module.css';

export function MoleculeBuilder() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();
  const { t } = useLanguage();

  const [currentMoleculeIndex, setCurrentMoleculeIndex] = useState(0);
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [selectedBondType, setSelectedBondType] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentMolecule = moleculeBuilderData.molecules[currentMoleculeIndex];

  const addAtom = (atomId) => {
    const atom = moleculeBuilderData.availableAtoms.find((a) => a.id === atomId);
    if (atom) {
      setSelectedAtoms((prev) => [...prev, atom]);
    }
  };

  const removeAtom = (index) => {
    setSelectedAtoms((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSelection = () => {
    setSelectedAtoms([]);
    setSelectedBondType(null);
  };

  const checkMolecule = useCallback(() => {
    const molecule = currentMolecule;

    // Count selected atoms by element
    const atomCounts = selectedAtoms.reduce((acc, atom) => {
      acc[atom.id] = (acc[atom.id] || 0) + 1;
      return acc;
    }, {});

    // Check if atoms match required
    const atomsMatch = molecule.requiredAtoms.every(
      (req) => atomCounts[req.element] === req.count
    );

    // Check if no extra atoms
    const totalRequired = molecule.requiredAtoms.reduce((sum, req) => sum + req.count, 0);
    const totalSelected = selectedAtoms.length;
    const noExtraAtoms = totalSelected === totalRequired;

    // Check bond type
    const bondMatch = selectedBondType === molecule.bondType;

    const isCorrect = atomsMatch && noExtraAtoms && bondMatch;

    // Store result
    const result = {
      moleculeId: molecule.id,
      molecule: molecule.name,
      isCorrect,
      selectedAtoms: [...selectedAtoms],
      selectedBondType,
    };

    setResults((prev) => [...prev, result]);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: `${t('games.moleculeBuilder.correct')} ${t(`games.moleculeBuilder.moleculeData.${molecule.id}.explanation`)}`,
      });
    } else {
      let errorMessage = t('games.moleculeBuilder.notQuite');
      if (!atomsMatch || !noExtraAtoms) {
        errorMessage += ` ${t('games.moleculeBuilder.wrongAtoms')}`;
      }
      if (!bondMatch) {
        errorMessage += ` ${t('games.moleculeBuilder.wrongBond')}`;
      }
      setFeedback({
        type: 'error',
        message: errorMessage,
      });
    }

    // Move to next molecule or complete
    setTimeout(() => {
      setFeedback(null);
      if (currentMoleculeIndex < moleculeBuilderData.molecules.length - 1) {
        setCurrentMoleculeIndex((prev) => prev + 1);
        clearSelection();
      } else {
        completeGame([...results, result]);
      }
    }, 3000);
  }, [currentMolecule, selectedAtoms, selectedBondType, currentMoleculeIndex, results, t]);

  const completeGame = (finalResults) => {
    const correctCount = finalResults.filter((r) => r.isCorrect).length;
    const passed = correctCount >= moleculeBuilderData.passingScore;

    updateProgress('moleculeBuilder', {
      score: correctCount,
      totalItems: moleculeBuilderData.totalItems,
      passed,
    });

    setShowCompletion(true);
  };

  if (showCompletion) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const passed = correctCount >= moleculeBuilderData.passingScore;

    return (
      <GameLayout title={t('games.moleculeBuilder.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {correctCount} / {moleculeBuilderData.totalItems}
          </p>

          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div
                key={index}
                className={`${styles.resultItem} ${result.isCorrect ? styles.correct : styles.incorrect}`}
              >
                <span className={styles.resultMolecule}>{t(`games.moleculeBuilder.moleculeData.${result.moleculeId}.name`)}</span>
                <span className={styles.resultStatus}>
                  {result.isCorrect ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>

          {passed ? (
            <p className={styles.message}>{t('games.moleculeBuilder.successMessage')}</p>
          ) : (
            <p className={styles.message}>
              {t('games.moleculeBuilder.needToPass').replace('{score}', moleculeBuilderData.passingScore)}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.moleculeBuilder.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.moleculeBuilder.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.moleculeBuilder.title')}>
      <div className={styles.game}>
        <div className={styles.progressBar}>
          <span>{t('games.moleculeBuilder.molecule')} {currentMoleculeIndex + 1} / {moleculeBuilderData.totalItems}</span>
        </div>

        <div className={styles.targetMolecule}>
          <h2 className={styles.targetName}>{t(`games.moleculeBuilder.moleculeData.${currentMolecule.id}.name`)}</h2>
          <p className={styles.targetFormula}>{currentMolecule.formula}</p>
          <p className={styles.targetHint}>{t(`games.moleculeBuilder.moleculeData.${currentMolecule.id}.hint`)}</p>
        </div>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <div className={styles.buildArea}>
          <h3 className={styles.sectionTitle}>{t('games.moleculeBuilder.yourMolecule')}</h3>
          
          <div className={styles.selectedAtoms}>
            {selectedAtoms.length === 0 ? (
              <p className={styles.emptyMessage}>{t('games.moleculeBuilder.selectAtoms')}</p>
            ) : (
              selectedAtoms.map((atom, index) => (
                <div
                  key={index}
                  className={styles.selectedAtom}
                  onClick={() => removeAtom(index)}
                >
                  <span className={styles.atomSymbol}>{atom.symbol}</span>
                  <span className={styles.removeIcon}>×</span>
                </div>
              ))
            )}
          </div>

          <div className={styles.bondSelection}>
            <h4 className={styles.subSectionTitle}>{t('games.moleculeBuilder.bondType')}</h4>
            <div className={styles.bondTypes}>
              {moleculeBuilderData.bondTypes.map((bond) => (
                <button
                  key={bond.id}
                  className={`${styles.bondButton} ${selectedBondType === bond.id ? styles.selected : ''}`}
                  onClick={() => setSelectedBondType(bond.id)}
                >
                  {t(`games.moleculeBuilder.bondTypeData.${bond.id}.name`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.atomPalette}>
          <h3 className={styles.sectionTitle}>{t('games.moleculeBuilder.availableAtoms')}</h3>
          <div className={styles.atomGrid}>
            {moleculeBuilderData.availableAtoms.map((atom) => (
              <button
                key={atom.id}
                className={styles.atomButton}
                onClick={() => addAtom(atom.id)}
              >
                <span className={styles.atomSymbol}>{atom.symbol}</span>
                <span className={styles.atomName}>{t(`games.moleculeBuilder.atomData.${atom.id}.name`)}</span>
                <span className={styles.atomValence}>{t('games.moleculeBuilder.valence')}: {atom.valence}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={clearSelection}>
            {t('games.moleculeBuilder.clear')}
          </Button>
          <Button
            variant="primary"
            onClick={checkMolecule}
            disabled={selectedAtoms.length === 0 || !selectedBondType}
          >
            {t('games.moleculeBuilder.check')}
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
