
import React, { useState, useEffect } from 'react';
import { Website } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import WebsiteCard from './components/WebsiteCard';
import InAppWindow from './components/InAppWindow';
import AddWebsiteModal from './components/AddWebsiteModal';
import { PlusIcon } from './components/icons/PlusIcon';
import './index.css';

const App: React.FC = () => {
  const categories = ['게임', '음악', '미술'];
  const [websites, setWebsites] = useLocalStorage<Website[]>('my-websites', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [inAppWindowUrl, setInAppWindowUrl] = useState<string | null>(null);

  const openInAppWindow = (url: string) => {
    setInAppWindowUrl(url);
  };

  const closeInAppWindow = () => {
    setInAppWindowUrl(null);
  };

  // Load generated public sites manifest and merge into websites list
  useEffect(() => {
    let cancelled = false;
    // Use Vite base URL so manifest is found both in dev and when served under a subpath
    const manifestPath = `${import.meta.env.BASE_URL || '/'}sites.json`.replace(/\/\/+/, '/');
    fetch(manifestPath)
      .then(res => {
        if (!res.ok) throw new Error('sites.json not found (' + res.status + ') at ' + manifestPath);
        return res.json();
      })
      .then((sites: Website[]) => {
        if (cancelled) return;
        // Always prefer the generated manifest from public/sites.json and replace stored websites.
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
        const processedSites = sites.map(site => ({
          ...site,
          // If url starts with / and doesn't explicitly start with base, prepend it
          url: site.url.startsWith('/') && !site.url.startsWith(baseUrl)
            ? `${baseUrl}${site.url}`
            : site.url,
          // Do the same for imageUrl
          imageUrl: site.imageUrl.startsWith('/') && !site.imageUrl.startsWith(baseUrl)
            ? `${baseUrl}${site.imageUrl}`
            : site.imageUrl
        }));
        setWebsites(() => processedSites);
      })
      .catch(err => {
        // Log manifest load errors to help debugging (network/path/base issues)
        // eslint-disable-next-line no-console
        console.warn('Could not load sites.json manifest:', err);
      });
    return () => { cancelled = true; };
  }, [setWebsites]);

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
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
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
          <button
            onClick={() => { localStorage.removeItem('my-websites'); location.reload(); }}
            className="add-button"
            style={{ marginLeft: '0.5rem', backgroundColor: '#334155' }}
            title="Reset sites from public/sites.json"
          >
            Reset Sites
          </button>
        </header>

        <nav className="category-nav">
          <ul className="category-list">
            {['All', ...categories].map(category => (
              <li key={category} className="category-list-item">
                <button
                  onClick={() => setCurrentCategory(category)}
                  className={`category-button ${currentCategory === category ? 'active' : ''
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
              {(() => {
                const visible = filteredWebsites.slice(0, 10);
                const placeholdersNeeded = Math.max(0, 10 - visible.length);
                const placeholders = Array.from({ length: placeholdersNeeded }).map((_, i) => ({
                  id: `placeholder-${i}`,
                  name: '',
                  url: '',
                  imageUrl: '',
                  category: '',
                } as any));
                return [...visible, ...placeholders].map((website: any) => (
                  <WebsiteCard
                    key={website.id}
                    website={website}
                    onDelete={handleDeleteWebsite}
                    onOpen={openInAppWindow}
                  />
                ));
              })()}
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
      <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: 'lime', padding: 10, borderRadius: 5, fontSize: 12, zIndex: 9999 }}>
        Items: {websites ? websites.length : 'null'} <br />
        Cat: {currentCategory}
      </div>
    </div>
  );
};

export default App;
