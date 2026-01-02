import React, { useEffect, useRef, useState } from 'react';

interface InAppWindowProps {
  url: string;
  onClose: () => void;
}

const InAppWindow: React.FC<InAppWindowProps> = ({ url, onClose }) => {
  // If url is a root-relative path, prepend Vite base so iframe works when app is served under subpath
  const base = (import.meta.env && (import.meta.env.BASE_URL as string)) || '/';
  // Build candidate path (root-relative -> include index.html)
  let iframeSrcCandidate = url;
  try {
    if (iframeSrcCandidate.startsWith('/') && !iframeSrcCandidate.startsWith(base)) {
      const trimmed = iframeSrcCandidate.replace(/^\/+/, '').replace(/\/+$/, '');
      const hasHtml = /\.html?$/.test(iframeSrcCandidate);
      const pathPart = hasHtml ? trimmed : `${trimmed}/index.html`;
      iframeSrcCandidate = `${base.replace(/\/$/, '')}/${pathPart}`;
    }
  } catch (e) {
    // fallback: use url as-is
  }

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const lastKeyRef = useRef<string>('');
  const prevBlobRef = useRef<string | null>(null);

  // Directly use the url.
  useEffect(() => {
    setIframeSrc(iframeSrcCandidate);
    setLoaded(true);
  }, [iframeSrcCandidate]);

  // helper: copy URL to clipboard
  const copyUrl = async () => {
    try {
      const toCopy = iframeSrc ?? iframeSrcCandidate;
      if (!toCopy) return;
      await navigator.clipboard.writeText(toCopy);
      // small feedback via console (UI feedback could be added)
      console.log('[InAppWindow] URL copied to clipboard:', toCopy);
    } catch (e) {
      console.error('[InAppWindow] copy failed', e);
    }
  };

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
                onClick={() => window.open(iframeSrc ?? iframeSrcCandidate, '_blank', 'noopener')}
                style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 6 }}
              >
                새 탭으로 열기
              </button>
            </div>
          </div>
        )}
        {error && (
          <div style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
            <div>시도한 URL:</div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{iframeSrc ?? iframeSrcCandidate}</div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={copyUrl} style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.35rem 0.6rem', borderRadius: 6 }}>URL 복사</button>
              <button onClick={() => { console.log('[InAppWindow] Opening URL in new tab:', iframeSrc ?? iframeSrcCandidate); window.open(iframeSrc ?? iframeSrcCandidate, '_blank', 'noopener'); }} style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.35rem 0.6rem', borderRadius: 6 }}>새 탭으로 열기</button>
            </div>
          </div>
        )}
        {!error && !loaded && (
          <div style={{ padding: '1rem' }}>
            <button
              onClick={() => window.open(iframeSrc ?? iframeSrcCandidate, '_blank', 'noopener')}
              style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.4rem 0.65rem', borderRadius: 6 }}
            >
              새 탭으로 열기 (임시)
            </button>
          </div>
        )}

        <iframe
          key={(iframeSrc ?? '') + '|' + attempt}
          className="inapp-iframe"
          src={iframeSrc ?? undefined}
          title={url}
          // Note: removing `allow-same-origin` strengthens sandboxing but may restrict some pages.
          // If the framed site requires same-origin access, the '새 탭으로 열기' fallback will still work.
          sandbox="allow-scripts allow-forms allow-popups"
          onLoad={() => { setLoaded(true); setError(null); console.log('[InAppWindow] iframe loaded:', iframeSrc ?? iframeSrcCandidate); }}
          onError={() => { console.error('[InAppWindow] iframe onError:', iframeSrc ?? iframeSrcCandidate); setError('iframe 로드 실패 (onError).'); }}
        />
      </div>
    </div>
  );
};

export default InAppWindow;
