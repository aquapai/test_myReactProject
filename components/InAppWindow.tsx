import React from 'react';

interface InAppWindowProps {
  url: string;
  onClose: () => void;
}

const InAppWindow: React.FC<InAppWindowProps> = ({ url, onClose }) => {
  // If url is a root-relative path, prepend Vite base so iframe works when app is served under subpath
  const base = (import.meta.env && (import.meta.env.BASE_URL as string)) || '/';
  let iframeSrc = url;
  try {
    if (iframeSrc.startsWith('/')) {
      // avoid double slashes
      iframeSrc = `${base.replace(/\/$/, '')}/${iframeSrc.replace(/^\/+/, '')}`;
    }
  } catch (e) {
    // fallback: use url as-is
  }

  return (
    <div className="inapp-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="inapp-window" onClick={e => e.stopPropagation()}>
        <div className="inapp-header">
          <div className="inapp-title">{url}</div>
          <button className="inapp-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <iframe
          className="inapp-iframe"
          src={iframeSrc}
          title={url}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default InAppWindow;
