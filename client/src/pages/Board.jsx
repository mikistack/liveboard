import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/board/TopBar';
import Toolbar from '../components/board/Toolbar';
import StatusBar from '../components/board/StatusBar';

const Board = () => {
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState('select');

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

      <TopBar title="Sprint Planning Q3" />
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
