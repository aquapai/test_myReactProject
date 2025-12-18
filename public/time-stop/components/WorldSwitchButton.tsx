import React from 'react';
import { World } from '../App';

interface WorldSwitchButtonProps {
  world: World;
  onClick: () => void;
}

const WorldSwitchButton: React.FC<WorldSwitchButtonProps> = ({ world, onClick }) => {
  const isParallel = world === 'parallel';

  const buttonText = isParallel ? '[ RESTORE TIMELINE ]' : '[ SWITCH WORLD ]';

  const baseClasses = 'fixed bottom-5 right-5 z-50 px-4 py-2 border-2 font-mono text-sm uppercase transition-all duration-300 backdrop-blur-sm bg-black/30';

  const normalClasses = 'border-slate-600 text-slate-300 hover:bg-cyan-400/20 hover:border-cyan-400 hover:text-cyan-300';

  const parallelClasses = 'border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:bg-red-500/20 hover:border-red-500 hover:text-red-400';

  return (
    <button onClick={onClick} className={`${baseClasses} ${isParallel ? parallelClasses : normalClasses}`}>
      {buttonText}
    </button>
  );
};

export default WorldSwitchButton;