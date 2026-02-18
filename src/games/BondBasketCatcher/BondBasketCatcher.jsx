import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../../components/layout/GameLayout';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { bondBasketData } from './bondBasketData';
import appleSprite from '../../assets/games/bond-apple.svg';
import basketSprite from '../../assets/games/basket.svg';
import treeSprite from '../../assets/games/tree.svg';
import styles from './BondBasketCatcher.module.css';

const AREA_HEIGHT = 420;
const ITEM_SIZE = 56;
const ITEM_RADIUS = ITEM_SIZE / 2;
const BASKET_WIDTH = 148;

function randomFromArray(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function BondBasketCatcher() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateProgress } = useProgress();

  const areaRef = useRef(null);
  const basketXRef = useRef(380);
  const timeLeftRef = useRef(bondBasketData.gameDuration);
  const acceptedTypeRef = useRef('ionic');
  const fallingItemsRef = useRef([]);
  const popupIdRef = useRef(0);
  const [areaWidth, setAreaWidth] = useState(760);
  const [areaHeight, setAreaHeight] = useState(AREA_HEIGHT);
  const [timeLeft, setTimeLeft] = useState(bondBasketData.gameDuration);
  const [acceptedType, setAcceptedType] = useState(() => randomFromArray(bondBasketData.basketTypes));
  const [basketX, setBasketX] = useState(380);
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongCatch, setWrongCatch] = useState(0);
  const [missed, setMissed] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [scorePopups, setScorePopups] = useState([]);
  const [isPointerActive, setIsPointerActive] = useState(false);

  const getNextPopupId = useCallback(() => {
    popupIdRef.current += 1;
    return `popup-${popupIdRef.current}`;
  }, []);

  const replaceFallingItems = useCallback((nextItems) => {
    fallingItemsRef.current = nextItems;
    setFallingItems(nextItems);
  }, []);

  useEffect(() => {
    acceptedTypeRef.current = acceptedType;
  }, [acceptedType]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    fallingItemsRef.current = fallingItems;
  }, [fallingItems]);

  const updateBasketPosition = useCallback(
    (nextXRaw) => {
      const clamped = clamp(nextXRaw, BASKET_WIDTH / 2, areaWidth - BASKET_WIDTH / 2);
      basketXRef.current = clamped;
      setBasketX(clamped);
    },
    [areaWidth]
  );

  useEffect(() => {
    const updateWidth = () => {
      if (!areaRef.current) return;
      const nextWidth = areaRef.current.clientWidth;
      const nextHeight = areaRef.current.clientHeight;
      setAreaWidth(nextWidth);
      setAreaHeight(nextHeight);
      setBasketX((prev) => {
        const clamped = clamp(prev, BASKET_WIDTH / 2, nextWidth - BASKET_WIDTH / 2);
        basketXRef.current = clamped;
        return clamped;
      });
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (showCompletion) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [showCompletion]);

  useEffect(() => {
    if (showCompletion || timeLeft <= 0) return undefined;

    const typeTimer = setInterval(() => {
      setAcceptedType((current) => {
        const elapsedSeconds = bondBasketData.gameDuration - timeLeftRef.current;
        const warmupSeconds = bondBasketData.warmupSeconds || 0;
        if (elapsedSeconds < warmupSeconds) {
          return current;
        }

        const options = bondBasketData.basketTypes.filter((type) => type !== current);
        return randomFromArray(options.length > 0 ? options : bondBasketData.basketTypes);
      });
    }, bondBasketData.typeChangeIntervalMs);

    return () => clearInterval(typeTimer);
  }, [showCompletion, timeLeft]);

  useEffect(() => {
    if (showCompletion || timeLeft <= 0) return undefined;

    let spawnTimeoutId;

    const spawnOne = () => {
      if (showCompletion || timeLeftRef.current <= 0) {
        return;
      }

      const elapsedSeconds = bondBasketData.gameDuration - timeLeftRef.current;
      const warmupSeconds = bondBasketData.warmupSeconds || 0;
      const postWarmupDuration = Math.max(1, bondBasketData.gameDuration - warmupSeconds);
      const rawProgress = (elapsedSeconds - warmupSeconds) / postWarmupDuration;
      const clampedProgress = clamp(rawProgress, 0, 1);
      const accelerationExponent = bondBasketData.accelerationExponent || 1;
      const paceRatio = Math.pow(clampedProgress, accelerationExponent);

      const startInterval = bondBasketData.spawnIntervalStartMs || bondBasketData.spawnIntervalMs;
      const endInterval = bondBasketData.spawnIntervalEndMs || 380;
      const currentInterval =
        startInterval - (startInterval - endInterval) * paceRatio;

      const startSpeed = bondBasketData.fallSpeedStart || 90;
      const endSpeed = bondBasketData.fallSpeedEnd || 235;
      const baseSpeed = startSpeed + (endSpeed - startSpeed) * paceRatio;

      const element = randomFromArray(bondBasketData.fallingItems);
      const minX = ITEM_RADIUS;
      const maxX = Math.max(ITEM_RADIUS + 1, areaWidth - ITEM_RADIUS);
      const maxConcurrentItems = bondBasketData.maxConcurrentItems || 3;

      const activeItemsCount = fallingItemsRef.current.filter(
        (item) => item.status === 'falling'
      ).length;

      if (activeItemsCount >= maxConcurrentItems) {
        spawnTimeoutId = setTimeout(spawnOne, currentInterval);
        return;
      }

      const speedVariance = bondBasketData.fallSpeedVariance || 0;
      const spawnYMin =
        typeof bondBasketData.spawnYMin === 'number' ? bondBasketData.spawnYMin : -140;
      const spawnYMax =
        typeof bondBasketData.spawnYMax === 'number' ? bondBasketData.spawnYMax : -ITEM_RADIUS;
      const lowY = Math.min(spawnYMin, spawnYMax);
      const highY = Math.max(spawnYMin, spawnYMax);
      const spawnY = Math.random() * (highY - lowY) + lowY;

      replaceFallingItems([
        ...fallingItemsRef.current,
        {
          uid: `${element.id}-${Date.now()}-${Math.random()}`,
          label: element.label,
          type: element.type,
          x: Math.random() * (maxX - minX) + minX,
          y: spawnY,
          speed: baseSpeed + Math.random() * speedVariance,
          status: 'falling',
        },
      ]);

      spawnTimeoutId = setTimeout(spawnOne, currentInterval);
    };

    spawnOne();

    return () => {
      if (spawnTimeoutId) {
        clearTimeout(spawnTimeoutId);
      }
    };
  }, [areaWidth, replaceFallingItems, showCompletion, timeLeft]);

  useEffect(() => {
    if (showCompletion || timeLeft <= 0) return undefined;

    let animationFrameId;
    let lastTimestamp = performance.now();

    const animate = (timestamp) => {
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const basketY = areaHeight - 24;

      let correctDelta = 0;
      let wrongPenalty = 0;
      let missedPenalty = 0;
      let attemptsDelta = 0;
      let wrongDelta = 0;
      let missedDelta = 0;
      const popupEvents = [];

      const next = [];

      fallingItemsRef.current.forEach((item) => {
          if (item.status === 'wrong') {
            if (timestamp < item.wrongUntil) {
              next.push(item);
            }
            return;
          }

          if (item.status === 'correct') {
            if (timestamp < item.wrongUntil) {
              next.push(item);
            }
            return;
          }

          const nextY = item.y + item.speed * deltaSeconds;
          const inBasketHeight = nextY >= basketY - 12;
          const inBasketWidth = Math.abs(item.x - basketXRef.current) <= BASKET_WIDTH / 2;

          if (inBasketHeight && inBasketWidth) {
            attemptsDelta += 1;

            if (item.type === acceptedTypeRef.current) {
              correctDelta += 1;

              popupEvents.push({
                id: getNextPopupId(),
                x: item.x,
                y: basketY - 26,
                value: `+${bondBasketData.scoring.correct}`,
                type: 'positive',
              });

              next.push({
                ...item,
                y: basketY - 14,
                status: 'correct',
                wrongUntil: timestamp + 180,
              });
            } else {
              wrongDelta += 1;
              wrongPenalty += 1;

              popupEvents.push({
                id: getNextPopupId(),
                x: item.x,
                y: basketY - 26,
                value: `${bondBasketData.scoring.wrong}`,
                type: 'negative',
              });

              next.push({
                ...item,
                y: basketY - 14,
                status: 'wrong',
                wrongUntil: timestamp + 220,
              });
            }
            return;
          }

          if (nextY > areaHeight + ITEM_RADIUS) {
            attemptsDelta += 1;
            missedDelta += 1;
            missedPenalty += 1;

            popupEvents.push({
              id: getNextPopupId(),
              x: item.x,
              y: areaHeight - 52,
              value: `${bondBasketData.scoring.missed}`,
              type: 'negative',
            });
            return;
          }

          next.push({
            ...item,
            y: nextY,
          });
        });

      replaceFallingItems(next);

      if (correctDelta > 0) {
        setScore((prev) => prev + correctDelta * bondBasketData.scoring.correct);
      }
      if (wrongPenalty > 0) {
        setScore((prev) => prev + wrongPenalty * bondBasketData.scoring.wrong);
      }
      if (missedPenalty > 0) {
        setScore((prev) => prev + missedPenalty * bondBasketData.scoring.missed);
      }
      if (attemptsDelta > 0) {
        setAttempts((prev) => prev + attemptsDelta);
      }
      if (wrongDelta > 0) {
        setWrongCatch((prev) => prev + wrongDelta);
      }
      if (missedDelta > 0) {
        setMissed((prev) => prev + missedDelta);
      }
      if (popupEvents.length > 0) {
        setScorePopups((prev) => [...prev, ...popupEvents]);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [areaHeight, getNextPopupId, replaceFallingItems, showCompletion, t, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0 || showCompletion) return;

    setFallingItems([]);

    const totalItems = attempts;
    const passed = score >= bondBasketData.passingScore;

    updateProgress('bondBasketCatcher', {
      score,
      totalItems,
      passed,
    });

    setShowCompletion(true);
  }, [timeLeft, showCompletion, score, attempts, updateProgress]);

  useEffect(() => {
    if (scorePopups.length === 0) return undefined;
    const timer = setTimeout(() => {
      setScorePopups((prev) => prev.slice(Math.min(prev.length, 6)));
    }, 360);
    return () => clearTimeout(timer);
  }, [scorePopups]);

  const handlePointerMove = useCallback(
    (event) => {
      const isMousePointer = event.pointerType === 'mouse';
      if (!areaRef.current || showCompletion || (!isPointerActive && !isMousePointer)) return;
      const rect = areaRef.current.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      updateBasketPosition(nextX);
    },
    [showCompletion, updateBasketPosition, isPointerActive]
  );

  const handlePointerDown = useCallback(
    (event) => {
      if (!areaRef.current || showCompletion) return;
      if (event.pointerType !== 'mouse') {
        setIsPointerActive(true);
      }
      const rect = areaRef.current.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      updateBasketPosition(nextX);
    },
    [showCompletion, updateBasketPosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsPointerActive(false);
  }, []);

  const handleKeyMove = useCallback(
    (event) => {
      if (showCompletion) return;
      if (event.key === 'ArrowLeft') {
        updateBasketPosition(basketXRef.current - 26);
      }
      if (event.key === 'ArrowRight') {
        updateBasketPosition(basketXRef.current + 26);
      }
    },
    [showCompletion, updateBasketPosition]
  );

  if (showCompletion) {
    const passed = score >= bondBasketData.passingScore;

    return (
      <GameLayout title={t('games.bondBasketCatcher.title')} wideContent>
        <div className={styles.completion}>
          <h2 className={styles.completionTitle}>
            {passed ? t('common.congratulations') : t('common.keepPracticing')}
          </h2>
          <p className={styles.score}>
            {t('common.score')}: {score}
          </p>
          <p className={styles.message}>
            {passed
              ? t('games.bondBasketCatcher.successMessage')
              : t('games.bondBasketCatcher.needToPass').replace('{score}', bondBasketData.passingScore)}
          </p>

          <div className={styles.results}>
            <div className={styles.resultBox}>
              <p className={styles.resultTitle}>{t('games.bondBasketCatcher.correct')}</p>
              <p className={styles.resultValue}>{score}</p>
            </div>
            <div className={styles.resultBox}>
              <p className={styles.resultTitle}>{t('games.bondBasketCatcher.wrong')}</p>
              <p className={styles.resultValue}>{wrongCatch}</p>
            </div>
            <div className={styles.resultBox}>
              <p className={styles.resultTitle}>{t('games.bondBasketCatcher.missed')}</p>
              <p className={styles.resultValue}>{missed}</p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              {t('games.bondBasketCatcher.playAgain')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/hub')}>
              {t('games.bondBasketCatcher.backToHub')}
            </Button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={t('games.bondBasketCatcher.title')} wideContent>
      <div className={styles.game}>
        <p className={styles.instructions}>{t('games.bondBasketCatcher.instructions')}</p>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>{t('games.bondBasketCatcher.timeLeft')}</p>
            <p className={styles.statValue}>{timeLeft}s</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>{t('games.bondBasketCatcher.scoreLabel')}</p>
            <p className={styles.statValue}>{score}</p>
          </div>
        </div>

        <div
          ref={areaRef}
          className={styles.playArea}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onKeyDown={handleKeyMove}
          role="application"
          aria-label={t('games.bondBasketCatcher.playAreaAria')}
        >
          <img src={treeSprite} alt="" className={`${styles.tree} ${styles.treeLeft}`} aria-hidden="true" />
          <img src={treeSprite} alt="" className={`${styles.tree} ${styles.treeRight}`} aria-hidden="true" />

          {fallingItems.map((item) => (
            <div
              key={item.uid}
              className={`${styles.fallingItem} ${item.status === 'wrong' ? styles.wrongItem : ''} ${item.status === 'correct' ? styles.correctItem : ''}`}
              style={{ left: `${item.x}px`, top: `${item.y}px` }}
            >
              <img src={appleSprite} alt="" className={styles.itemImage} aria-hidden="true" />
              <span className={styles.itemLabel}>{item.label}</span>
            </div>
          ))}

          {scorePopups.map((popup) => (
            <div
              key={popup.id}
              className={`${styles.scorePopup} ${popup.type === 'positive' ? styles.scorePositive : styles.scoreNegative}`}
              style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
            >
              {popup.value}
            </div>
          ))}

          <div className={styles.basket} style={{ left: `${basketX}px` }}>
            <img src={basketSprite} alt="" className={styles.basketImage} aria-hidden="true" />
            <div className={styles.basketText}>
              <span className={styles.basketTitle}>{t('games.bondBasketCatcher.basket')}</span>
              <span className={styles.basketType}>{t(`games.bondBasketCatcher.types.${acceptedType}`)}</span>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
