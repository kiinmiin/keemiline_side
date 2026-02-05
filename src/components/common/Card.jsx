import { useRef, useEffect } from 'react';
import styles from './Card.module.css';

export function Card({
  id,
  content,
  draggable = true,
  state = 'default',
  onDragStart,
  onDragEnd,
  onClick,
  isDragging = false,
}) {
  const cardRef = useRef(null);

  const className = [
    styles.card,
    styles[state],
    isDragging && styles.dragging,
    !draggable && styles.notDraggable,
  ]
    .filter(Boolean)
    .join(' ');

  const handlePointerDown = (e) => {
    console.log('Card pointer down:', id, 'draggable:', draggable, 'has onDragStart:', !!onDragStart);
    if (draggable && onDragStart) {
      onDragStart(id, e);
    }
  };

  const handleClick = (e) => {
    if (!draggable && onClick) {
      onClick(id, e);
    }
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      role="button"
      tabIndex={draggable ? 0 : -1}
      aria-label={content}
    >
      {content}
    </div>
  );
}
