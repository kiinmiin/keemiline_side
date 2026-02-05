import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for drag and drop functionality
 * Supports both mouse and touch events via Pointer Events API
 */
export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null);

  const dropZonesRef = useRef(new Map());
  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Register a drop zone
  const registerDropZone = useCallback((id, element, acceptsFn) => {
    if (element) {
      dropZonesRef.current.set(id, { element, acceptsFn });
    } else {
      dropZonesRef.current.delete(id);
    }
  }, []);

  // Find which drop zone the pointer is over
  const findActiveDropZone = useCallback((x, y, itemId) => {
    for (const [zoneId, { element, acceptsFn }] of dropZonesRef.current) {
      const rect = element.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        // Check if this zone accepts the item
        if (acceptsFn(itemId)) {
          return zoneId;
        }
      }
    }
    return null;
  }, []);

  const handleDragStart = useCallback((itemId, event) => {
    event.preventDefault();
    console.log('Drag started:', itemId);

    draggedItemRef.current = itemId;
    isDraggingRef.current = true;

    setDraggedItem(itemId);
    setIsDragging(true);

    // Prevent scrolling on touch devices while dragging
    if (event.pointerType === 'touch') {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleDragMove = useCallback((event) => {
    if (!isDraggingRef.current || !draggedItemRef.current) {
      return;
    }

    const activeZone = findActiveDropZone(
      event.clientX,
      event.clientY,
      draggedItemRef.current
    );
    setActiveDropZone(activeZone);
  }, [findActiveDropZone]);

  const handleDragEnd = useCallback((event, onDropCallback) => {
    console.log('Drag end called, isDragging:', isDraggingRef.current, 'draggedItem:', draggedItemRef.current);
    if (!isDraggingRef.current || !draggedItemRef.current) return;

    const finalDropZone = findActiveDropZone(
      event.clientX,
      event.clientY,
      draggedItemRef.current
    );
    console.log('Final drop zone:', finalDropZone);

    // Re-enable scrolling on touch devices
    if (event.pointerType === 'touch') {
      document.body.style.overflow = '';
    }

    // Call the drop callback if over a valid zone
    if (finalDropZone && onDropCallback) {
      console.log('Calling drop callback');
      onDropCallback(draggedItemRef.current, finalDropZone);
    }

    // Reset state
    draggedItemRef.current = null;
    isDraggingRef.current = false;
    setDraggedItem(null);
    setIsDragging(false);
    setActiveDropZone(null);
  }, [findActiveDropZone]);

  return {
    draggedItem,
    isDragging,
    activeDropZone,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    registerDropZone,
  };
}
