
import React, { useState } from 'react';
import { Website } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import WebsiteCard from './components/WebsiteCard';
import InAppWindow from './components/InAppWindow';
import AddWebsiteModal from './components/AddWebsiteModal';
import { PlusIcon } from './components/icons/PlusIcon';
import './index.css';

const App: React.FC = () => {
  const categories = ['게임', '음악', '미술'];
  const [websites, setWebsites] = useLocalStorage<Website[]>('my-websites', [
    {
      id: '1',
      name: 'ArtStation',
      url: 'https://www.artstation.com/',
      imageUrl: 'https://picsum.photos/seed/1/600/400',
      category: '미술',
    },
    {
      id: '2',
      name: 'Spotify',
      url: 'https://open.spotify.com/',
      imageUrl: 'https://picsum.photos/seed/2/600/400',
      category: '음악',
    },
    {
      id: '3',
      name: 'Steam',
      url: 'https://store.steampowered.com/',
      imageUrl: 'https://picsum.photos/seed/3/600/400',
      category: '게임',
    },
    {
      id: '4',
      name: 'Behance',
      url: 'https://www.behance.net/',
      imageUrl: 'https://picsum.photos/seed/4/600/400',
      category: '미술',
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [inAppWindowUrl, setInAppWindowUrl] = useState<string | null>(null);

  const openInAppWindow = (url: string) => {
    setInAppWindowUrl(url);
  };

  const closeInAppWindow = () => {
    setInAppWindowUrl(null);
  };

  const handleAddWebsite = (name: string, url: string, category: string) => {
    const newWebsite: Website = {
      id: new Date().getTime().toString(),
      name,
      url,
      imageUrl: `https://picsum.photos/seed/${new Date().getTime()}/600/400`,
      category,
    };
    setWebsites([...websites, newWebsite]);
    setIsModalOpen(false);
  };

  const handleDeleteWebsite = (id: string) => {
    setWebsites(websites.filter(website => website.id !== id));
  };

  const filteredWebsites = websites.filter(website =>
    currentCategory === 'All' || website.category === currentCategory
  );

    return (
    <div className="app-container">
      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddWebsite}
        categories={categories}
      />
      <div className="content-wrapper">
        <header className="app-header">
          <div>
            <h1 className="main-title">My Websites</h1>
            <p className="subtitle">A personal collection of your projects and favorite sites.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
          >
            <PlusIcon className="add-button-icon" />
            Add New
          </button>
        </header>

        <nav className="category-nav">
          <ul className="category-list">
            {['All', ...categories].map(category => (
              <li key={category} className="category-list-item">
                <button
                  onClick={() => setCurrentCategory(category)}
                  className={`category-button ${
                    currentCategory === category ? 'active' : ''
                  }`}
                >
                  {category === 'All' ? '전체' : category}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {filteredWebsites.length > 0 ? (
            <div className="website-grid">
              {filteredWebsites.map(website => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  onDelete={handleDeleteWebsite}
                  onOpen={openInAppWindow}
                />
              ))}
            </div>
          ) : (
            <div className="no-websites-message">
              <h2 className="no-websites-title">No websites in this category!</h2>
              <p className="no-websites-text">Try selecting another category or adding a new website.</p>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} 웹사이트라이탄두리치킨. All Rights Reserved.</p>
          <p className="footer-address">주소: 쿠퍼티노 애플 링</p>
        </footer>
      </div>
      {inAppWindowUrl && (
        <InAppWindow url={inAppWindowUrl} onClose={closeInAppWindow} />
      )}
    </div>
  );
};

export default App;
