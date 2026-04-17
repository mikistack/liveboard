import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import { useBoardStore } from '../../store/boardStore';
import { useSocket } from '../../hooks/useSocket';

const generator = rough.generator();

const Canvas = ({ boardId, activeTool }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const elements = useBoardStore((state) => state.elements);
  const setElements = useBoardStore((state) => state.setElements);
  const persistElements = useBoardStore((state) => state.persistElements);
  const socket = useSocket(boardId);

  // Helper to draw a single element
  const drawElement = (rc, element) => {
    const { type, x1, y1, x2, y2, points, stroke } = element;
    const options = { stroke, strokeWidth: 2, roughness: 0.5 };

    switch (type) {
      case 'pencil':
        return rc.linearPath(points, options);
      case 'rectangle':
        return rc.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      case 'circle':
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return rc.circle(x1, y1, radius * 2, options);
      case 'line':
        return rc.line(x1, y1, x2, y2, options);
      case 'arrow':
        const angle = Math.atan2(y2 - y1, x2 - x1);
        rc.line(x1, y1, x2, y2, options);
        rc.line(x2, y2, x2 - 15 * Math.cos(angle - Math.PI / 6), y2 - 15 * Math.sin(angle - Math.PI / 6), options);
        rc.line(x2, y2, x2 - 15 * Math.cos(angle + Math.PI / 6), y2 - 15 * Math.sin(angle + Math.PI / 6), options);
        return;
      default:
        return;
    }
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const rc = rough.canvas(canvas);
    
    elements.forEach((element) => drawElement(rc, element));
  }, [elements]);

  useEffect(() => {
    if (!socket) return;
    socket.on('element-update', (newElement) => {
      setElements((prev) => {
        const index = prev.findIndex((el) => el.id === newElement.id);
        if (index === -1) return [...prev, newElement];
        const updated = [...prev];
        updated[index] = newElement;
        return updated;
      });
    });
    return () => socket.off('element-update');
  }, [socket, setElements]);

  const getElementAt = (x, y) => {
    // Simple AABB hit detection for Demo
    return [...elements].reverse().find(el => {
      if (el.type === 'pencil') {
        return el.points.some(([px, py]) => Math.abs(px - x) < 10 && Math.abs(py - y) < 10);
      }
      const minX = Math.min(el.x1, el.x2);
      const maxX = Math.max(el.x1, el.x2);
      const minY = Math.min(el.y1, el.y2);
      const maxY = Math.max(el.y1, el.y2);
      return x >= minX - 10 && x <= maxX + 10 && y >= minY - 10 && y <= maxY + 10;
    });
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    
    if (activeTool === 'select') {
      const element = getElementAt(clientX, clientY);
      if (element) {
        setSelectedElement(element);
        setDragOffset({ x: clientX - (element.x1 || element.points[0][0]), y: clientY - (element.y1 || element.points[0][1]) });
      } else {
        setSelectedElement(null);
      }
      return;
    }
    
    setIsDrawing(true);
    const id = crypto.randomUUID();
    const newElement = {
      id,
      type: activeTool,
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      points: [[clientX, clientY]],
      stroke: '#38bdf8',
    };
    setElements((prev) => [...prev, newElement]);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (activeTool === 'select' && selectedElement) {
      // Dragging logic
      const dx = clientX - (selectedElement.x1 || selectedElement.points[0][0]) - dragOffset.x;
      const dy = clientY - (selectedElement.y1 || selectedElement.points[0][1]) - dragOffset.y;
      
      const updated = {
        ...selectedElement,
        x1: selectedElement.x1 + dx,
        y1: selectedElement.y1 + dy,
        x2: selectedElement.x2 + dx,
        y2: selectedElement.y2 + dy,
        points: selectedElement.points?.map(([px, py]) => [px + dx, py + dy])
      };
      
      setElements(prev => prev.map(el => el.id === selectedElement.id ? updated : el), true);
      socket?.emit('draw-element', { boardId, element: updated });
      return;
    }

    if (!isDrawing) return;

    const last = elements[elements.length - 1];
    if (!last) return;

    const updated = { ...last };
    if (updated.type === 'pencil') {
      updated.points = [...updated.points, [clientX, clientY]];
    } else {
      updated.x2 = clientX;
      updated.y2 = clientY;
    }

    setElements((prev) => {
      const next = [...prev];
      next[next.length - 1] = updated;
      return next;
    }, true);
    
    socket?.emit('draw-element', { boardId, element: updated });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (activeTool === 'select') setSelectedElement(null);
    // Persist to database after drawing/moving
    persistElements(boardId);
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`absolute inset-0 z-10 touch-none ${activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
    />
  );
};

export default Canvas;
