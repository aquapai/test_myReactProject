import React, { useEffect, useState } from 'react';

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
      // Build path relative to Vite base. For folders ("/foo/"), point directly to index.html
      const trimmed = iframeSrc.replace(/^\/+/, '').replace(/\/+$/, '');
      const hasHtml = /\.html?$/.test(iframeSrc);
      const pathPart = hasHtml ? trimmed : `${trimmed}/index.html`;
      iframeSrc = `${base.replace(/\/$/, '')}/${pathPart}`;
    }
  } catch (e) {
    // fallback: use url as-is
  }
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoaded(false);
    setError(null);
  }, [iframeSrc, attempt]);

  // fallback timeout: if not loaded within 8s show a helpful message
  useEffect(() => {
    const t = setTimeout(() => {
      if (!loaded) setError('로드가 지연되고 있습니다. 네트워크 또는 경로를 확인하세요.');
    }, 8000);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <div className="inapp-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="inapp-window" onClick={e => e.stopPropagation()}>
        <div className="inapp-header">
          <div className="inapp-title">{iframeSrc}</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="inapp-close"
              onClick={() => { setAttempt(a => a + 1); setLoaded(false); setError(null); }}
              title="Reload iframe"
              aria-label="Reload"
              style={{ fontSize: '1rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem' }}
            >⟳</button>
            <button className="inapp-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>

        {!loaded && !error && (
          <div style={{ padding: '1rem', color: '#cbd5e1' }}>로딩 중…</div>
        )}
        {error && (
          <div style={{ padding: '1rem', color: '#fecaca' }}>
            오류: {error}
            <div style={{ marginTop: '0.5rem' }}>
              확인 사항: 네트워크, `public/`에 `index.html` 존재 여부, 그리고 Dev 서버의 base 경로를 확인하세요.
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button
                onClick={() => window.open(iframeSrc, '_blank', 'noopener')}
                style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 6 }}
              >
                새 탭으로 열기
              </button>
            </div>
          </div>
        )}
        {!error && !loaded && (
          <div style={{ padding: '1rem' }}>
            <button
              onClick={() => window.open(iframeSrc, '_blank', 'noopener')}
              style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.4rem 0.65rem', borderRadius: 6 }}
            >
              새 탭으로 열기 (임시)
            </button>
          </div>
        )}

        <iframe
          key={iframeSrc + '|' + attempt}
          className="inapp-iframe"
          src={iframeSrc}
          title={url}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => { setLoaded(true); setError(null); }}
          onError={() => setError('iframe 로드 실패 (onError).')}
        />
      </div>
    </div>
  );
};

export default InAppWindow;
