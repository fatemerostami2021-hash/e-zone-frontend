import { useEffect, useRef, useState } from 'react';

const POSTER = '/image/hero-poster.webp';
const DESKTOP_SRC = '/video/hero-home.mp4';
const MOBILE_SRC = '/video/hero-home-banner.mp4';

/**
 * Hero background video that never blocks first paint:
 * - starts loading only after the page "load" event + idle time
 * - lighter file on mobile
 * - skipped on Save-Data / 2G / reduced-motion (poster stays)
 * - plays only while visible
 */
export default function HeroVideo({ className }) {
  const ref = useRef(null);
  const [src, setSrc] = useState('');

  useEffect(() => {
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slow || reduce) return undefined;

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const pick = () => setSrc(mobile ? MOBILE_SRC : DESKTOP_SRC);
    let timer;
    let idle;
    const start = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(pick, { timeout: 2500 });
      else timer = setTimeout(pick, 800);
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!src || !video) return undefined;
    video.muted = true;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        video.pause();
      }
    });
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src || undefined}
      poster={POSTER}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
