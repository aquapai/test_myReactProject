import React from 'react';
import { Home, Search, Trophy, User } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', icon: Home, label: '검증소' },
    { id: 'feed', icon: Search, label: '감시' },
    { id: 'leaderboard', icon: Trophy, label: '랭킹' },
    { id: 'profile', icon: User, label: '내정보' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t-2 border-zinc-800 pb-safe safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${
                isActive ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''} />
              <span className={`text-[10px] ${isActive ? 'font-black' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;