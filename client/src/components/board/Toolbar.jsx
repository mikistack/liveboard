import React from 'react';
import { Pencil, Square, Circle, ArrowRight, Minus, StickyNote, Type, MousePointer2, Undo2, Redo2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'freehand', icon: Pencil, label: 'Draw (D)' },
  { id: 'rectangle', icon: Square, label: 'Rectangle (R)' },
  { id: 'circle', icon: Circle, label: 'Circle (O)' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
  { id: 'line', icon: Minus, label: 'Line (L)' },
  { id: 'sticky', icon: StickyNote, label: 'Sticky Note (S)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
];

const Toolbar = ({ activeTool, setActiveTool }) => {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl"
      >
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
            className={`p-3 rounded-xl transition-all flex items-center justify-center relative group ${
              activeTool === tool.id 
                ? 'bg-sky-500 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tool.icon className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-2 py-1 bg-[#0f172a] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/5 shadow-lg transition-opacity">
              {tool.label}
            </span>
          </button>
        ))}

        <div className="w-full h-px bg-white/10 my-1" />
        
        <button className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center" title="Color">
          <Palette className="w-5 h-5" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl"
      >
        <button className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center" title="Undo (Ctrl+Z)">
          <Undo2 className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center" title="Redo (Ctrl+Y)">
          <Redo2 className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default Toolbar;
