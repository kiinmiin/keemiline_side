import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for drag and drop functionality
 * Supports both mouse and touch events via Pointer Events API
 */
export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const dropZonesRef = useRef(new Map());
  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragElementRef = useRef(null);
  const dragPreviewRef = useRef(null);
  const initialOffsetRef = useRef({ x: 0, y: 0 });

  // Cleanup drag preview on unmount
  useEffect(() => {
    return () => {
      if (dragPreviewRef.current) {
        dragPreviewRef.current.remove();
        dragPreviewRef.current = null;
      }
    };
  }, []);

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

  const createDragPreview = useCallback((element, x, y) => {
    // Clone the element for the preview
    const preview = element.cloneNode(true);
    const rect = element.getBoundingClientRect();
    
    // Store offset from cursor to element top-left
    initialOffsetRef.current = {
      x: x - rect.left,
      y: y - rect.top
    };
    
    // Style the preview
    preview.style.position = 'fixed';
    preview.style.left = `${rect.left}px`;
    preview.style.top = `${rect.top}px`;
    preview.style.width = `${rect.width}px`;
    preview.style.height = `${rect.height}px`;
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.opacity = '0.9';
    preview.style.transform = 'rotate(3deg) scale(1.05)';
    preview.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    preview.style.transition = 'none';
    
    document.body.appendChild(preview);
    dragPreviewRef.current = preview;
  }, []);

  const updateDragPreview = useCallback((x, y) => {
    if (dragPreviewRef.current) {
      const newX = x - initialOffsetRef.current.x;
      const newY = y - initialOffsetRef.current.y;
      dragPreviewRef.current.style.left = `${newX}px`;
      dragPreviewRef.current.style.top = `${newY}px`;
    }
  }, []);

  const removeDragPreview = useCallback(() => {
    if (dragPreviewRef.current) {
      dragPreviewRef.current.remove();
      dragPreviewRef.current = null;
    }
  }, []);

  const handleDragStart = useCallback((itemId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Capture the pointer to receive all pointer events
    event.target.setPointerCapture(event.pointerId);
    dragElementRef.current = event.target;

    draggedItemRef.current = itemId;
    isDraggingRef.current = true;

    setDraggedItem(itemId);
    setIsDragging(true);
    setDragPosition({ x: event.clientX, y: event.clientY });

    // Create visual preview
    createDragPreview(event.currentTarget, event.clientX, event.clientY);

    // Prevent scrolling on touch devices while dragging
    if (event.pointerType === 'touch') {
      document.body.style.overflow = 'hidden';
    }
  }, [createDragPreview]);

  const handleDragMove = useCallback((event) => {
    if (!isDraggingRef.current || !draggedItemRef.current) {
      return;
    }

    event.preventDefault();
    
    setDragPosition({ x: event.clientX, y: event.clientY });
    updateDragPreview(event.clientX, event.clientY);
    
    const activeZone = findActiveDropZone(
      event.clientX,
      event.clientY,
      draggedItemRef.current
    );
    setActiveDropZone(activeZone);
  }, [findActiveDropZone, updateDragPreview]);

  const handleDragEnd = useCallback((event, onDropCallback) => {
    if (!isDraggingRef.current || !draggedItemRef.current) return;

    event.preventDefault();
    
    // Release pointer capture
    if (dragElementRef.current && event.pointerId) {
      try {
        dragElementRef.current.releasePointerCapture(event.pointerId);
      } catch (e) {
        // Ignore if capture was already released
      }
    }

    const finalDropZone = findActiveDropZone(
      event.clientX,
      event.clientY,
      draggedItemRef.current
    );

    // Re-enable scrolling on touch devices
    if (event.pointerType === 'touch') {
      document.body.style.overflow = '';
    }

    // Remove the visual preview
    removeDragPreview();

    // Call the drop callback if over a valid zone
    if (finalDropZone && onDropCallback) {
      onDropCallback(draggedItemRef.current, finalDropZone);
    }

    // Reset state
    draggedItemRef.current = null;
    isDraggingRef.current = false;
    dragElementRef.current = null;
    setDraggedItem(null);
    setIsDragging(false);
    setActiveDropZone(null);
    setDragPosition({ x: 0, y: 0 });
  }, [findActiveDropZone, removeDragPreview]);

  return {
    draggedItem,
    isDragging,
    activeDropZone,
    dragPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    registerDropZone,
  };
}
