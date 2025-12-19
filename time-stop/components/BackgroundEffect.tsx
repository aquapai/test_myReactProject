import React from 'react';
import { World } from '../App';

interface BackgroundEffectProps {
  world: World;
}

const Gear: React.FC<{ size: string; position: string; animation: string }> = ({ size, position, animation }) => (
  <div className={`absolute ${size} ${position} ${animation} opacity-[0.03]`}>
    <svg className="w-full h-full text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  </div>
);

const NormalBackground: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <Gear size="w-64 h-64" position="top-[-5rem] left-[-5rem]" animation="animate-[spin_40s_linear_infinite]" />
    <Gear size="w-96 h-96" position="bottom-[-10rem] right-[-10rem]" animation="animate-[spin_60s_linear_infinite_reverse]" />
    <Gear size="w-48 h-48" position="bottom-[5rem] left-[2rem]" animation="animate-[spin_30s_linear_infinite]" />
  </div>
);

const Crack: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute bg-cyan-400/20 w-px h-[30%] ${className}`} />
);

const ParallelBackground: React.FC = () => (
    <div className="fixed inset-0 z-0 overflow-hidden animate-[pulse_10s_ease-in-out_infinite]">
     <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(239,68,68,0.1),rgba(255,255,255,0))]"></div>
     <Crack className="top-0 left-1/3 rotate-[25deg]" />
     <Crack className="bottom-0 right-1/4 -rotate-[45deg]" />
     <Crack className="top-1/4 right-1/2 h-[40%] rotate-[10deg] opacity-70" />
     <Crack className="bottom-1/3 left-1/4 h-[20%] -rotate-[15deg] opacity-50" />
  </div>
);

const BackgroundEffect: React.FC<BackgroundEffectProps> = ({ world }) => {
  return (
    <div className="transition-opacity duration-1000">
        {world === 'normal' 
            ? <NormalBackground /> 
            : <ParallelBackground />
        }
    </div>
  );
};

export default BackgroundEffect;