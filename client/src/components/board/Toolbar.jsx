import React, { useState } from 'react';
import { Pencil, Square, Circle, ArrowRight, Minus, StickyNote, Type, MousePointer2, Undo2, Redo2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBoardStore } from '../../store/boardStore';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'pencil', icon: Pencil, label: 'Pencil (P)' },
  { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
  { id: 'circle', icon: Circle, label: 'Circle (O)' },
  { id: 'line', icon: Minus, label: 'Line (L)' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
];

const colors = [
  '#38bdf8', // sky
  '#fb7185', // rose
  '#4ade80', // green
  '#facc15', // yellow
  '#c084fc', // purple
  '#ffffff', // white
];

const Toolbar = ({ activeTool, setActiveTool }) => {
  const [showColors, setShowColors] = useState(false);
  const undo = useBoardStore((state) => state.undo);
  const redo = useBoardStore((state) => state.redo);
  const strokeColor = useBoardStore((state) => state.strokeColor);
  const setStrokeColor = useBoardStore((state) => state.setStrokeColor);

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
      {/* Undo/Redo */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl"
      >
        <button 
          onClick={undo}
          className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center" 
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button 
          onClick={redo}
          className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center" 
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Tools */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl"
      >
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-3 rounded-xl transition-all flex items-center justify-center group relative ${
              activeTool === tool.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={tool.label}
          >
            <tool.icon className={`w-5 h-5 ${activeTool === tool.id ? 'scale-110' : ''}`} />
          </button>
        ))}
        
        <div className="w-full h-px bg-white/5 my-1" />
        
        <div className="relative">
          <button 
            onClick={() => setShowColors(!showColors)}
            className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            style={{ color: strokeColor }}
          >
            <Palette className="w-5 h-5" />
          </button>
          
          {showColors && (
            <div className="absolute left-full ml-4 top-0 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-2 shadow-2xl">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setStrokeColor(c);
                    setShowColors(false);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${strokeColor === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Toolbar;
