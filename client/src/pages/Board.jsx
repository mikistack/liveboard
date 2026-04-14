import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/board/TopBar';
import Toolbar from '../components/board/Toolbar';
import StatusBar from '../components/board/StatusBar';

const Board = () => {
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState('select');
  const { currentBoard, isLoading, error, fetchBoardById } = useBoardStore();

  useEffect(() => {
    if (id) {
      fetchBoardById(id);
    }
  }, [id, fetchBoardById]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (error || !currentBoard) {
    return (
      <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center text-white">
        {error || 'Board not found'}
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0f172a] font-['Inter']">
      {/* Background Dots Pattern for Canvas */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0'
        }}
      />

      <TopBar board={currentBoard} />
      <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
      
      {/* The Actual Canvas Component will go here */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <p className="text-slate-600 text-sm">Canvas Engine (Rough.js) will be mounted here.</p>
      </div>

      <StatusBar zoom={100} />
    </div>
  );
};

export default Board;
