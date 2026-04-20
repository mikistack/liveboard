import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import { useBoardStore } from '../../store/boardStore';
import { useAuthStore } from '../../store/authStore';
import { useSocket } from '../../hooks/useSocket';

const generator = rough.generator();

const Canvas = ({ boardId, activeTool }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [remoteCursors, setRemoteCursors] = useState({});
  
  const user = useAuthStore((state) => state.user);
  const elements = useBoardStore((state) => state.elements);
  const strokeColor = useBoardStore((state) => state.strokeColor);
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

    socket.on('user-cursor', ({ userId, username, x, y }) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [userId]: { username, x, y }
      }));
    });

    return () => {
      socket.off('element-update');
      socket.off('user-cursor');
    };
  }, [socket, setElements]);

  const getElementAt = (x, y) => {
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
      stroke: strokeColor,
    };
    setElements((prev) => [...prev, newElement]);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Broadcast cursor position
    socket?.emit('cursor-move', { boardId, x: clientX, y: clientY, username: user?.username });

    if (activeTool === 'select' && selectedElement) {
      const dx = clientX - (selectedElement.x1 || selectedElement.points[0][0]) - dragOffset.x;
      const dy = clientY - (selectedElement.y1 || selectedElement.points[0][1]) - dragOffset.y;
      
      const updated = {
        ...selectedElement,
        x1: (selectedElement.x1 || 0) + dx,
        y1: (selectedElement.y1 || 0) + dy,
        x2: (selectedElement.x2 || 0) + dx,
        y2: (selectedElement.y2 || 0) + dy,
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
    persistElements(boardId);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`absolute inset-0 z-10 touch-none ${activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
      />
      
      {/* Remote Cursors Overlay */}
      {Object.entries(remoteCursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute pointer-events-none z-50 transition-all duration-75"
          style={{ left: cursor.x, top: cursor.y }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-indigo-500 drop-shadow-lg">
            <path d="M5.653 3.123l12.433 12.432-5.013 1.154 3.122 5.617-1.897 1.054-3.122-5.617-4.226 3.84z" />
          </svg>
          <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-4 mt-1 shadow-md">
            {cursor.username}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Canvas;
