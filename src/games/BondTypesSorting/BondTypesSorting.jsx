import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FeedbackMessage } from '../../components/common/FeedbackMessage';
import { useProgress } from '../../context/ProgressContext';
import { bondTypesData } from './bondTypesData';
import { shuffleArray } from '../../utils/shuffle';
import styles from './BondTypesSorting.module.css';

export function BondTypesSorting() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();

  // Shuffle items and zones once on mount
  const shuffledItems = useMemo(() => shuffleArray(bondTypesData.items), []);
  const shuffledZones = useMemo(() => shuffleArray(bondTypesData.zones), []);

  const [availableItems, setAvailableItems] = useState(shuffledItems);
  const [placedItems, setPlacedItems] = useState({
    chemical: [],
    'not-chemical': [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [itemStates, setItemStates] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);

  const validatePlacement = useCallback((itemId, zoneId) => {
    const item = bondTypesData.items.find((i) => i.id === itemId);
    const zone = bondTypesData.zones.find((z) => z.id === zoneId);

    if (!item || !zone) return false;

    return item.isChemicalBond === zone.accepts;
  }, []);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItem(itemId);
    setFeedback(null);
  }, []);

  const handleZoneClick = useCallback((zoneId) => {
    if (!selectedItem) {
      setFeedback({
        type: 'info',
        message: 'Please select an item first!',
      });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const item = availableItems.find((i) => i.id === selectedItem);
    if (!item) return;

    const isCorrect = validatePlacement(selectedItem, zoneId);

    // Remove from available items
    setAvailableItems((prev) => prev.filter((i) => i.id !== selectedItem));

    // Add to placed items
    setPlacedItems((prev) => ({
      ...prev,
      [zoneId]: [...prev[zoneId], { ...item, zoneId }],
    }));

    // Set item state
    setItemStates((prev) => ({
      ...prev,
      [selectedItem]: isCorrect ? 'correct' : 'incorrect',
    }));

    // Show feedback
    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: `Correct! ${item.explanation}`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: `Not quite. ${item.explanation}`,
      });
    }

    // Clear selection
    setSelectedItem(null);
    setTimeout(() => setFeedback(null), 5000);
  }, [selectedItem, availableItems, validatePlacement]);

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
      <GameLayout title={bondTypesData.title}>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className={styles.score}>
            Your Score: {score} / {bondTypesData.totalItems}
          </p>
          {passed ? (
            <p className={styles.message}>{bondTypesData.successMessage}</p>
          ) : (
            <p className={styles.message}>
              You need at least {bondTypesData.passingScore} correct to pass. Try again!
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
    <GameLayout title={bondTypesData.title}>
      <div className={styles.game}>
        <p className={styles.instructions}>
          Select an item, then click on the correct category
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
              className={`${styles.clickZone} ${selectedItem ? styles.clickable : ''}`}
              onClick={() => handleZoneClick(zone.id)}
            >
              <h3 className={styles.zoneTitle}>{zone.label}</h3>
              <div className={styles.zoneCards}>
                {placedItems[zone.id].length === 0 ? (
                  <div className={styles.emptyMessage}>
                    {selectedItem ? 'Click here to place' : 'No items yet'}
                  </div>
                ) : (
                  placedItems[zone.id].map((item) => (
                    <Card
                      key={item.id}
                      id={item.id}
                      content={item.name}
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
            Available Items {selectedItem && '(Click on a category above)'}
          </h3>
          <div className={styles.cardDeck}>
            {availableItems.map((item) => (
              <div
                key={item.id}
                className={selectedItem === item.id ? styles.selectedCard : ''}
                onClick={() => handleItemSelect(item.id)}
              >
                <Card
                  id={item.id}
                  content={item.name}
                  draggable={false}
                  state={selectedItem === item.id ? 'default' : 'default'}
                />
              </div>
            ))}
          </div>
        </div>

        {availableItems.length === 0 && (
          <div className={styles.checkButton}>
            <Button variant="success" size="large" fullWidth onClick={checkCompletion}>
              Check Results
            </Button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
