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
    if (iframeSrcCandidate.startsWith('/')) {
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

  // Directly use the built index.html path first. This avoids Blob-relative asset path issues.
  useEffect(() => {
    let cancelled = false;
    let createdBlob: string | null = null;
    const key = `${iframeSrcCandidate}|${attempt}`;
    // avoid re-running the expensive fetch/rewrite if we've already applied this key
    if (lastKeyRef.current === key) return;

    async function fetchAndRewrite() {
      setLoaded(false);
      setError(null);

      try {
        const res = await fetch(iframeSrcCandidate, { cache: 'no-store' });
        if (!res.ok) throw new Error(`fetch ${iframeSrcCandidate} status ${res.status}`);
        const html = await res.text();

        if (cancelled) return;

        // Compute site base (strip trailing /index.html)
        const siteBase = iframeSrcCandidate.replace(/\/index\.html$/i, '').replace(/\/$/, '');

        // Replace root-absolute references (src="/..." or href="/....") with either
        // - siteBase + /... if that file exists under the site's __built__ folder
        // - otherwise leave the original /... so global assets (like /index.css) still resolve
        const attrRegex = /(src|href)=\s*(["'])\/([^\"']+)/gi;
        const matches = Array.from(html.matchAll(attrRegex));
        let rewritten = html;

        // Helper to escape a string for RegExp
        const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        for (const m of matches) {
          const attr = m[1];
          const quote = m[2];
          const path = m[3];
          const original = `${attr}=${quote}/${path}`;
          const siteCandidate = `${siteBase}/${path}`;
          try {
            // check whether the asset exists under siteCandidate (same origin)
            // Note: we await here to ensure sequential checks and reduce load.
            // eslint-disable-next-line no-await-in-loop
            let probe = await fetch(siteCandidate, { method: 'GET', cache: 'no-store' });
            if (probe.ok) {
              const re = new RegExp(escapeRegExp(original), 'g');
              rewritten = rewritten.replace(re, `${attr}=${quote}${siteCandidate}`);
            } else {
              // try the common local static server at :8000 (used for diagnostics/build serving)
              const alt = `http://localhost:8000${siteCandidate}`;
              try {
                // eslint-disable-next-line no-await-in-loop
                const probe2 = await fetch(alt, { method: 'GET', cache: 'no-store' });
                if (probe2.ok) {
                  const re = new RegExp(escapeRegExp(original), 'g');
                  rewritten = rewritten.replace(re, `${attr}=${quote}${alt}`);
                }
              } catch (e2) {
                console.warn('[InAppWindow] alt probe failed for', alt, e2);
              }
            }
          } catch (e) {
            // If probe fails, be conservative and leave original path
            console.warn('[InAppWindow] probe failed for', siteCandidate, e);
          }
        }

        // Create blob URL and use it as iframe src so relative references resolved against absolute URLs we rewrote above
        const blob = new Blob([rewritten], { type: 'text/html' });
        createdBlob = URL.createObjectURL(blob);
        // revoke previous blob if present
        if (prevBlobRef.current) {
          try { URL.revokeObjectURL(prevBlobRef.current); } catch (e) { /* ignore */ }
        }
        prevBlobRef.current = createdBlob;
        lastKeyRef.current = key;
        setIframeSrc(createdBlob);
        return;
      } catch (err) {
        console.warn('[InAppWindow] fetch/rewrite failed, falling back to direct src', err);
        // fallback to direct src so browser loads assets from server paths
          if (!cancelled) {
          lastKeyRef.current = key;
          setIframeSrc(iframeSrcCandidate);
          setError('빌드된 파일을 리라이트하지 못했습니다. 직접 경로로 로드합니다.');
        }
      }
    }

    fetchAndRewrite();

    const t = setTimeout(() => {
      if (!createdBlob) {
        setError('로드가 지연되고 있습니다. 서버가 실행중인지 확인하거나 새 탭으로 열어보세요.');
        // Try to auto-open the URL in a new tab as a fallback. May be blocked by popup blockers.
        try {
          if (!autoOpened) {
            const target = iframeSrc ?? iframeSrcCandidate;
            if (target) {
              window.open(target, '_blank', 'noopener');
              setAutoOpened(true);
              console.log('[InAppWindow] auto-opened fallback URL in new tab:', target);
            }
          }
        } catch (e) {
          console.warn('[InAppWindow] auto-open failed', e);
        }
      }
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(t);
      if (createdBlob) {
        try { URL.revokeObjectURL(createdBlob); } catch (e) { /* ignore */ }
      }
    };
  }, [iframeSrcCandidate, attempt]);

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
