
import React from 'react';
import { Website } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface WebsiteCardProps {
  website: Website;
  onDelete: (id: string) => void;
  onOpen?: (url: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onDelete, onOpen }) => {
  const isPlaceholder = !website.name && !website.url;

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (isPlaceholder) {
    return (
      <div className="group relative bg-slate-800/40 rounded-lg overflow-hidden shadow-sm transition-all duration-300 cursor-default">
        <div className="relative">
          <div className="w-full h-48 bg-slate-900/50" />
        </div>
        <div className="p-5">
          <div className="h-6 bg-slate-900/60 rounded mb-2 w-3/4" />
          <div className="h-4 bg-slate-900/50 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="website-card group"
      onClick={() => onOpen && onOpen(website.url)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onOpen && onOpen(website.url);
      }}
    >
      <div className="card-image-container">
        {website.emoji ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-6xl select-none group-hover:scale-110 transition-transform duration-500">
            {website.emoji}
          </div>
        ) : (
          <>
            <img className="card-image" src={website.imageUrl} alt={`Screenshot of ${website.name}`} />
            <div className="card-overlay"></div>
          </>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{website.name}</h3>
        {isValidUrl(website.url) ? (
          <a
            href={website.url}
            onClick={e => { e.preventDefault(); onOpen ? onOpen(website.url) : window.open(website.url, '_blank'); }}
            className="card-url"
            onMouseDown={e => e.stopPropagation()}
          >
            {website.url}
          </a>
        ) : (
          <p className="card-url">{website.url}</p>
        )}
      </div>

      <button
        onClick={e => { e.stopPropagation(); onDelete(website.id); }}
        className="card-delete-btn"
        aria-label={`Delete ${website.name}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default WebsiteCard;
