import React from 'react';
import { World } from '../App';

interface FooterProps {
  world: World;
}

const Footer: React.FC<FooterProps> = ({ world }) => {
  const isParallel = world === 'parallel';
  
  return (
    <footer className="mt-12 pt-6 border-t border-slate-700/50 text-center">
      <p className="transition-opacity duration-500 text-sm">
        {isParallel 
          ? <span><span className="text-red-500">{'>'}</span> SYSTEM: TIME HALTED // ANOMALY PERSISTS</span> 
          : <span><span className="text-cyan-400">{'>'}</span> SYSTEM: STABLE // CHRONO-SIGNATURE VERIFIED</span>
        }
      </p>
      <p className={`mt-4 text-xs uppercase tracking-widest ${isParallel ? 'opacity-70' : 'text-slate-500'}`}>
        Portfolio &copy; {new Date().getFullYear()}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;