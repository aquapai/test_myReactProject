import React from 'react';
import { World } from '../App';
import { ClockIcon } from './icons/ClockIcon';

interface NavbarProps {
  world: World;
}

const Navbar: React.FC<NavbarProps> = ({ world }) => {
  const isParallel = world === 'parallel';
  
  const linkClasses = `transition-colors duration-300 ${isParallel ? 'text-slate-300 hover:text-cyan-300' : 'text-slate-400 hover:text-white'}`;
  
  const navBorder = isParallel ? 'border-cyan-400/30' : 'border-slate-700/50';

  const titleShadow = isParallel
    ? { textShadow: '0 0 8px #ef4444, 0 0 12px #dc2626' }
    : { textShadow: '0 0 8px #22d3ee, 0 0 12px #0891b2' };
  
  const titleColor = isParallel ? 'text-red-400' : 'text-cyan-300';
  const iconColor = isParallel ? 'text-red-400' : 'text-cyan-400';

  return (
    <nav className={`p-4 text-center border-b ${navBorder} flex justify-between items-center flex-shrink-0 bg-[#0a0f1a]/80 backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        <ClockIcon className={`w-6 h-6 ${iconColor} transition-colors duration-500`} />
        <h1 className={`text-2xl font-bold ${titleColor} uppercase tracking-widest transition-colors duration-500`} style={titleShadow}>
          Temporal Log
        </h1>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-sm uppercase">
          <a href="#" className={linkClasses}>Home</a>
          <a href="#" className={linkClasses}>Archive</a>
          <a href="#" className={linkClasses}>About</a>
      </div>
    </nav>
  );
};

export default Navbar;