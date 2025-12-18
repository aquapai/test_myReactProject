import React from 'react';
import { World } from '../App';
import { PixelSakuya } from './PixelSakuya';

interface SidebarProps {
  world: World;
}

const SidebarWidget: React.FC<{ title: string; isParallel: boolean; children: React.ReactNode }> = ({ title, isParallel, children }) => {
  const titleColor = isParallel ? 'text-red-400' : 'text-cyan-300';
  const borderColor = isParallel ? 'border-red-500/30' : 'border-slate-700';

  return (
    <div className={`relative border ${borderColor} bg-gradient-to-b from-slate-800/40 to-slate-900/30 p-4`}>
       {/* Corner Brackets */}
      <div className={`absolute -top-px -left-px w-3 h-3 border-t border-l ${borderColor}`} />
      <div className={`absolute -top-px -right-px w-3 h-3 border-t border-r ${borderColor}`} />
      <div className={`absolute -bottom-px -left-px w-3 h-3 border-b border-l ${borderColor}`} />
      <div className={`absolute -bottom-px -right-px w-3 h-3 border-b border-r ${borderColor}`} />
      
      <h3 className={`text-lg mb-3 pb-2 font-semibold tracking-wider ${titleColor}`}>
        {`// ${title}`}
      </h3>
      <div className="border-t border-slate-700/50 pt-3">
        {children}
      </div>
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ world }) => {
  const isParallel = world === 'parallel';

  const ProfileText = () => (
    <p className="text-sm text-slate-400 leading-relaxed">
      Welcome. This space serves as a collection of my endeavors—each a testament to a philosophy of perfection and timeless design.
    </p>
  );
  
  const tags = ['UI/UX', 'Time', 'Retro', 'Design', 'Sakuya', 'Tech', 'PixelArt', 'Case Study'];
  const recentPosts = ['Temporal Mechanics in UI Design', 'The Aesthetics of a Frozen Moment', 'PC-98 Era: A Digital Archeology', `Project "Silver Phantom"`];

  return (
    <div className="space-y-6">
      <SidebarWidget title="Artificer Profile" isParallel={isParallel}>
        <div className="flex flex-col gap-4">
          <div className="w-28 h-28 mx-auto border-2 border-slate-700 bg-slate-900/50 p-1">
             <PixelSakuya world={world} />
          </div>
          <ProfileText />
        </div>
      </SidebarWidget>

      <SidebarWidget title="Tag Cloud" isParallel={isParallel}>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <a href="#" key={tag} className={`text-xs uppercase px-2 py-1 border transition-all duration-300 ${isParallel ? 'border-slate-600 text-slate-400 hover:bg-red-500/20 hover:border-red-500' : 'border-slate-700 text-slate-500 hover:bg-cyan-400/20 hover:border-cyan-400 hover:text-cyan-300'}`}>
              {tag}
            </a>
          ))}
        </div>
      </SidebarWidget>

      <SidebarWidget title="Recent Logs" isParallel={isParallel}>
        <ul className="space-y-2">
          {recentPosts.map(post => (
             <li key={post} className={`text-sm transition-colors duration-300 truncate ${isParallel ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-500 hover:text-white'}`}>
                <a href="#">{`> ${post}`}</a>
             </li>
          ))}
        </ul>
      </SidebarWidget>
    </div>
  );
};

export default Sidebar;