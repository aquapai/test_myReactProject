import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BlogFeed from './components/BlogFeed';
import Footer from './components/Footer';
import WorldSwitchButton from './components/WorldSwitchButton';
import BackgroundEffect from './components/BackgroundEffect';
import Sidebar from './components/Sidebar';

export type World = 'normal' | 'parallel';

const WorldSwitchTransition: React.FC = () => (
  <div className="fixed inset-0 z-[100] world-switch-anim"></div>
);

const App: React.FC = () => {
  const [world, setWorld] = useState<World>('normal');
  const [isSwitching, setIsSwitching] = useState(false);

  const toggleWorld = () => {
    if (isSwitching) return;
    setIsSwitching(true);
    setTimeout(() => {
      setWorld(prev => (prev === 'normal' ? 'parallel' : 'normal'));
      setIsSwitching(false);
    }, 500);
  };

  return (
    <div className={`w-full h-full max-w-[1600px] crt-effect text-slate-300 relative transition-colors duration-500 overflow-hidden`}>
      <BackgroundEffect world={world} />
      {isSwitching && <WorldSwitchTransition />}
      
      <div className="relative z-10 h-full grid grid-cols-[1fr_400px] grid-rows-[auto_1fr] overflow-hidden">
        
        {/* Main Content Area */}
        <div className="col-start-1 row-start-1 row-span-2 flex flex-col overflow-hidden border-r border-slate-700/50">
          <Navbar world={world} />
          <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar p-6">
            <main className="flex-grow">
              <BlogFeed world={world} />
            </main>
            <Footer world={world} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="col-start-2 row-start-1 row-span-2 h-full overflow-y-auto p-6 custom-scrollbar">
          <Sidebar world={world} />
        </aside>

      </div>
      
      <WorldSwitchButton world={world} onClick={toggleWorld} />
    </div>
  );
};

export default App;