import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { bondTypesData } from './bondTypesData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './BondTypesSorting.module.css';

export function BondTypesSorting() {
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

  // Shuffle items and zones once on mount
  const shuffledItems = useMemo(() => shuffleArray(bondTypesData.items), []);
  const shuffledZones = useMemo(() => shuffleArray(bondTypesData.zones), []);

  const [availableItems, setAvailableItems] = useState(shuffledItems);
  const [placedItems, setPlacedItems] = useState({
    chemical: [],
    'not-chemical': [],
  });
  const [feedback, setFeedback] = useState(null);
  const [itemStates, setItemStates] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);

  const validatePlacement = useCallback((itemId, zoneId) => {
    const item = bondTypesData.items.find((i) => i.id === itemId);
    const zone = bondTypesData.zones.find((z) => z.id === zoneId);

    if (!item || !zone) return false;

    return item.isChemicalBond === zone.accepts;
  }, []);

  const handleDropItem = useCallback(
    (itemId, zoneId) => {
      const item = availableItems.find((i) => i.id === itemId);
      if (!item) return;

      const isCorrect = validatePlacement(itemId, zoneId);

      // Remove from available items
      setAvailableItems((prev) => prev.filter((i) => i.id !== itemId));

      // Add to placed items
      setPlacedItems((prev) => ({
        ...prev,
        [zoneId]: [...prev[zoneId], { ...item, zoneId }],
      }));

      // Set item state
      setItemStates((prev) => ({
        ...prev,
        [itemId]: isCorrect ? 'correct' : 'incorrect',
      }));

      // Show feedback
      if (isCorrect) {
        setFeedback({
          type: 'success',
          message: `${t('games.bondTypesSorting.correct')} ${t(`games.bondTypesSorting.items.${item.id}.explanation`)}`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: `${t('games.bondTypesSorting.notQuite')} ${t(`games.bondTypesSorting.items.${item.id}.explanation`)}`,
        });
      }

      setTimeout(() => setFeedback(null), 5000);
    },
    [availableItems, validatePlacement, t]
  );

  const checkCompletion = () => {
    const totalPlaced = Object.values(placedItems).reduce(
      (sum, items) => sum + items.length,
      0
    );

    if (totalPlaced === bondTypesData.totalItems) {
      const correctCount = Object.values(itemStates).filter(
        (state) => state === 'correct'
      ).length;

      const passed = correctCount >= bondTypesData.passingScore;

      updateProgress('bondTypesSorting', {
        score: correctCount,
        totalItems: bondTypesData.totalItems,
        passed,
      });

      setShowCompletion(true);
    }
  };

  const getScore = () => {
    return Object.values(itemStates).filter((state) => state === 'correct').length;
  };

  if (showCompletion) {
    const score = getScore();
    const passed = score >= bondTypesData.passingScore;

    return (
      <GameLayout title={t('games.bondTypesSorting.title')}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {score} / {bondTypesData.totalItems}
          </p>
          {passed ? (
            <p className={styles.message}>{t('games.bondTypesSorting.successMessage')}</p>
          ) : (
            <p className={styles.message}>
              {t('games.bondTypesSorting.needToPass').replace('{score}', bondTypesData.passingScore)}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.bondTypesSorting.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.bondTypesSorting.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.bondTypesSorting.title')}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          {t('games.bondTypesSorting.instructions')}
        </p>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        )}

        <div className={styles.dropZones}>
          {shuffledZones.map((zone) => (
            <div
              key={zone.id}
              ref={(el) =>
                registerDropZone(zone.id, el, () => true)
              }
              className={`${styles.clickZone} ${activeDropZone === zone.id ? styles.activeDropZone : ''}`}
            >
              <h3 className={styles.zoneTitle}>
                {zone.id === 'chemical'
                  ? t('games.bondTypesSorting.chemicalBonds')
                  : t('games.bondTypesSorting.notChemicalBonds')}
              </h3>
              <div className={styles.zoneCards}>
                {placedItems[zone.id].length === 0 ? (
                  <div className={styles.emptyMessage}>
                    {t('games.bondTypesSorting.noItems')}
                  </div>
                ) : (
                  placedItems[zone.id].map((item) => (
                    <Card
                      key={item.id}
                      id={item.id}
                      content={t(`games.bondTypesSorting.items.${item.id}.name`)}
                      draggable={false}
                      state={itemStates[item.id]}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.availableCards}>
          <h3 className={styles.deckTitle}>
            {t('games.bondTypesSorting.availableItems')}
          </h3>
          <div className={styles.cardDeck}>
            {availableItems.map((item) => (
              <div
                key={item.id}
                className={`${draggedItem === item.id ? styles.draggingCard : ''}`}
                onPointerDown={(e) => handleDragStart(item.id, e)}
                onPointerMove={handleDragMove}
                onPointerUp={(e) => handleDragEnd(e, handleDropItem)}
                onPointerCancel={(e) => handleDragEnd(e, null)}
              >
                <Card
                  id={item.id}
                  content={t(`games.bondTypesSorting.items.${item.id}.name`)}
                  draggable={false}
                  state="default"
                />
              </div>
            ))}
          </div>
        </div>

        {availableItems.length === 0 && (
          <div className={styles.checkButton}>
            <Button variant="success" size="large" fullWidth onClick={checkCompletion}>
              {t('games.bondTypesSorting.checkResults')}
            </Button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
