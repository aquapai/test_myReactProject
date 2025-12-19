import React from 'react';
import { World } from '../App';
import { KnifeIcon } from './icons/KnifeIcon';

interface Post {
  id: number;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

interface BlogPostCardProps {
  post: Post;
  world: World;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, world }) => {
  const isParallel = world === 'parallel';

  const containerClasses = isParallel
    ? 'border-red-500/30 bg-red-950/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
    : 'border-slate-700/80 bg-slate-800/30';

  const titleColor = isParallel ? 'text-red-400' : 'text-cyan-300';
  
  const parallelTextGlitch = isParallel ? { textShadow: '1px 1px 0px rgba(0, 255, 255, 0.5), -1px -1px 0px rgba(255, 0, 0, 0.5)' } : {};

  return (
    <article className={`group border p-4 transition-all duration-300 hover:border-cyan-400/70 hover:bg-slate-800/50 ${containerClasses}`}>
      <header className="mb-3">
        <p className={`text-xs ${isParallel ? 'text-slate-400' : 'text-slate-500'}`}>
          [TIMESTAMP: {post.date}]
        </p>
        <h3 
          className={`text-xl font-semibold mt-1 transition-colors duration-300 group-hover:text-cyan-200 ${titleColor}`}
          style={parallelTextGlitch}
        >
          {post.title}
        </h3>
      </header>
      <p className="text-slate-400 text-sm leading-relaxed">{post.excerpt}</p>
      <footer className="mt-4 flex flex-wrap gap-2 items-center border-t border-slate-700/50 pt-3">
        <KnifeIcon className={`w-3 h-3 mr-1 ${isParallel ? 'text-red-500/70' : 'text-cyan-400/50'}`} />
        <span className="text-xs uppercase mr-2 text-slate-500">Tags:</span>
        {post.tags.map(tag => (
          <span key={tag} className={`text-xs uppercase px-2 py-0.5 border transition-colors duration-300 ${isParallel ? 'border-slate-700 text-slate-400' : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}>
            {tag}
          </span>
        ))}
      </footer>
    </article>
  );
};

export default BlogPostCard;