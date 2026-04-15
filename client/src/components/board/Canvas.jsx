import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import { useBoardStore } from '../../store/boardStore';
import { useSocket } from '../../hooks/useSocket';

const generator = rough.generator();

const Canvas = ({ boardId, activeTool }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const elements = useBoardStore((state) => state.elements);
  const setElements = useBoardStore((state) => state.setElements);
  const socket = useSocket(boardId);

  // Initial render and sync
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const rc = rough.canvas(canvas);
    
    elements.forEach((element) => {
      if (element.type === 'pencil') {
        rc.linearPath(element.points, { stroke: element.stroke, strokeWidth: 2 });
      }
    });

  }, [elements]);

  useEffect(() => {
    if (!socket) return;

    socket.on('element-update', (newElement) => {
      // Logic for incoming remote elements
      setElements((prev) => {
        const index = prev.findIndex((el) => el.id === newElement.id);
        if (index === -1) return [...prev, newElement];
        const updated = [...prev];
        updated[index] = newElement;
        return updated;
      });
    });

    return () => {
      socket.off('element-update');
    };
  }, [socket, setElements]);

  const handleMouseDown = (e) => {
    if (activeTool === 'select') return;
    
    setIsDrawing(true);
    const { clientX, clientY } = e;
    
    const id = crypto.randomUUID();
    const newElement = {
      id,
      type: activeTool,
      points: [[clientX, clientY]],
      stroke: '#38bdf8', // sky-400
    };

    setElements((prev) => [...prev, newElement]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { clientX, clientY } = e;
    const lastElement = elements[elements.length - 1];
    
    if (lastElement && lastElement.type === 'freehand') {
      const newPoints = [...lastElement.points, [clientX, clientY]];
      const updatedElement = { ...lastElement, points: newPoints };
      
      // Update local state
      setElements((prev) => {
        const next = [...prev];
        next[next.length - 1] = updatedElement;
        return next;
      });

      // Broadcast update
      socket?.emit('draw-element', { boardId, element: updatedElement });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 z-10 touch-none"
    />
  );
};

export default Canvas;
