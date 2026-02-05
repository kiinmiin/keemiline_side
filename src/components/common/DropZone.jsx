import { useRef, useEffect } from 'react';
import styles from './DropZone.module.css';

export function DropZone({
  id,
  label,
  accepts,
  onDrop,
  state = 'empty',
  items = [],
  registerDropZone,
  children,
}) {
  const zoneRef = useRef(null);

  useEffect(() => {
    if (registerDropZone && zoneRef.current) {
      console.log('Registering drop zone:', id);
      registerDropZone(id, zoneRef.current, accepts);
    }

    return () => {
      if (registerDropZone) {
        console.log('Unregistering drop zone:', id);
        registerDropZone(id, null, accepts);
      }
    };
  }, [id, accepts, registerDropZone]);

  const className = [styles.dropZone, styles[state]].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div ref={zoneRef} className={className}>
        {items.length === 0 && state !== 'hovering' && (
          <div className={styles.placeholder}>Drop items here</div>
        )}
        {children}
      </div>
    </div>
  );
}
