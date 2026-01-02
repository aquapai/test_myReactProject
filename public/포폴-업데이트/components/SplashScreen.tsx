import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Sequence: 
    // 0s: Mount
    // 2.5s: Start fade out
    // 3.5s: Unmount
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Pastel Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pastel-blue/20 rounded-full blur-[80px] animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pastel-purple/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Central Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-[40px] animate-breathing"></div>

      {/* Content */}
      <div className="relative z-10 text-center animate-slide-up">
        <h1 className="font-serif text-5xl md:text-7xl font-semibold text-slate-800 tracking-tight drop-shadow-sm mb-4">
          Popol Update
        </h1>
        <div className="h-[2px] w-16 mx-auto my-6 bg-slate-200 rounded-full"></div>
        <p className="font-sans text-slate-500 text-sm md:text-base tracking-[0.3em] uppercase font-medium">
          Add a Halo to Your Career
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;