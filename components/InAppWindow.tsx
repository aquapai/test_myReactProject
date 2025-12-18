import React from 'react';

interface InAppWindowProps {
  url: string;
  onClose: () => void;
}

const InAppWindow: React.FC<InAppWindowProps> = ({ url, onClose }) => {
  return (
    <div className="inapp-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="inapp-window" onClick={e => e.stopPropagation()}>
        <div className="inapp-header">
          <div className="inapp-title">{url}</div>
          <button className="inapp-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <iframe className="inapp-iframe" src={url} title={url} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
      </div>
    </div>
  );
};

export default InAppWindow;
