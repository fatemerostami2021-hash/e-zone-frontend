import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const COUNT_RE = /^(\D*)(\d[\d,.]*)(.*)$/;

/**
 * Makes every [data-bleed] block touch the viewport edges (and the hero touch the
 * header), whatever padding the layout wrappers add. Measures real positions, so it works in light and dark.
 */
function useFullBleedHero(rootRef, ready, deps) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!ready || !root) return undefined;
    const els = Array.from(root.querySelectorAll('[data-bleed]'));
    const hero = root.querySelector('.ezh-vhero');
    if (!els.length) return undefined;
    let lastGap = 0;

    const apply = () => {
      els.forEach((el) => { el.style.marginLeft = '0px'; el.style.marginRight = '0px'; });
      if (hero) hero.style.marginTop = '0px';
      const vw = document.documentElement.clientWidth;
      const rects = els.map((el) => el.getBoundingClientRect());
      els.forEach((el, i) => {
        el.style.marginLeft = `${-rects[i].left}px`;
        el.style.marginRight = `${-(vw - rects[i].right)}px`;
      });
      if (hero) {
        const header = document.querySelector('header');
        const r = rects[els.indexOf(hero)];
        if (header && r) {
          const gap = r.top - header.getBoundingClientRect().bottom;
          if (gap >= 0 && gap < 120) lastGap = gap;
        }
        hero.style.marginTop = `${-lastGap}px`;
      }
    };

    apply();
    window.addEventListener('resize', apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
    return () => {
      window.removeEventListener('resize', apply);
      els.forEach((el) => { el.style.marginLeft = ''; el.style.marginRight = ''; });
      if (hero) hero.style.marginTop = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);
}

/**
 * Scroll choreography for the public home page.
 * - desktop: Lenis smooth scroll + hero parallax + image parallax + magnetic buttons
 * - mobile : lighter reveals and counters only (native scroll)
 * - prefers-reduced-motion: nothing runs, content stays visible
 */
export default function useHomeFx(rootRef, ready, deps) {
  useFullBleedHero(rootRef, ready, deps);
  // the hero intro plays once per mount, not every time late data re-runs the effect
  const introPlayed = useRef(false);
  useEffect(() => () => { introPlayed.current = false; }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!ready || !root) return undefined;

    const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
    const mm = gsap.matchMedia();

    mm.add(
      {
        full: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
        lite: '(max-width: 768px) and (prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { full } = ctx.conditions;
        const q = gsap.utils.selector(root);
        const k = full ? 1 : 0.5;
        const cleanups = [];
        let lenis = null;

        root.classList.add(full ? 'ezh-fx' : 'ezh-fx-lite');
        cleanups.push(() => root.classList.remove('ezh-fx', 'ezh-fx-lite'));

        // ---- smooth scroll (desktop only) ----
        if (full) {
          lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          });
          lenis.on('scroll', ScrollTrigger.update);
          const tick = (time) => lenis.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          cleanups.push(() => {
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.destroy();
          });
        }

        // ---- scroll progress line ----
        gsap.to(q('.ezh-progress'), {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });

        // ---- hero intro (explicit end values, so a re-run can never animate 0 -> 0) ----
        const END = { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'all' };
        if (!introPlayed.current) {
          introPlayed.current = true;
          const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
          intro
            .fromTo(q('.ezh-pill'), { y: 24, opacity: 0 }, END, 0.2)
            .fromTo(q('.ezh-hero-title'), { y: 40, opacity: 0 }, END, 0.3)
            .fromTo(q('.ezh-hero-sub'), { y: 28, opacity: 0 }, END, 0.5)
            .fromTo(q('.ezh-hero-actions > *'), { y: 24, opacity: 0 }, { ...END, stagger: 0.1 }, 0.65)
            .fromTo(q('.ezh-mockup'), { x: 70 * dir * k, y: 30, opacity: 0 }, { ...END, duration: 1.2 }, 0.55);
        }

        // ---- hero scroll parallax (desktop) ----
        if (full) {
          const hero = q('.ezh-vhero')[0];
          const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
          gsap.to(q('.ezh-vhero-video'), { scale: 1.2, yPercent: 8, ease: 'none', scrollTrigger: st });
          gsap.to(q('.ezh-vhero-body .ezh-hero-content'), { yPercent: -14, opacity: 0.1, ease: 'none', scrollTrigger: st });
          gsap.to(q('.ezh-vhero-body .ezh-mockup'), { yPercent: -26, ease: 'none', scrollTrigger: st });
        }

        // ---- reveals + counters ----
        // IntersectionObserver instead of ScrollTrigger "once" triggers: lazy images and fonts
        // shift the layout after load, which made position-based triggers fire too early,
        // so text had already finished animating before the visitor reached it.
        const plays = new Map();
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              const tw = plays.get(e.target);
              if (tw) tw.play();
              io.unobserve(e.target);
            });
          },
          { rootMargin: '0px 0px -8% 0px' },
        );
        cleanups.push(() => io.disconnect());
        const watch = (el, tween) => { plays.set(el, tween); io.observe(el); };

        q('[data-fx]').forEach((el) => {
          let type = el.dataset.fx;
          if (!full && (type === 'left' || type === 'right')) type = 'up';
          const from = { opacity: 0, transition: 'none' };
          if (type === 'up') from.y = 60 * k;
          if (type === 'left') from.x = -90 * dir;
          if (type === 'right') from.x = 90 * dir;
          if (type === 'scale') { from.scale = 0.92; from.y = 30 * k; }
          if (type === 'clip') from.y = 30 * k;
          watch(el, gsap.fromTo(el, from, { ...END, duration: 1, ease: 'power3.out', paused: true }));
        });

        q('[data-stagger]').forEach((el) => {
          watch(el, gsap.fromTo(
            Array.from(el.children),
            { y: 50 * k, opacity: 0, transition: 'none' },
            { ...END, duration: 0.9, ease: 'power3.out', stagger: 0.12, paused: true },
          ));
        });

        q('.ezh-count').forEach((el) => {
          const original = el.textContent;
          const m = COUNT_RE.exec(original.trim());
          if (!m) return;
          const raw = m[2];
          const target = parseFloat(raw.replace(/,/g, ''));
          if (Number.isNaN(target)) return;
          const decimals = (raw.split('.')[1] || '').length;
          const useCommas = raw.includes(',');
          const fmt = (v) => {
            const s = v.toFixed(decimals);
            return useCommas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals }) : s;
          };
          const obj = { v: 0 };
          el.textContent = m[1] + fmt(0) + m[3];
          watch(el, gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power2.out',
            paused: true,
            onUpdate: () => { el.textContent = m[1] + fmt(obj.v) + m[3]; },
          }));
          cleanups.push(() => { el.textContent = original; });
        });

        // ---- rail train driven by scroll ----
        q('.ezh-rail').forEach((section) => {
          section.querySelectorAll('[data-marquee]').forEach((track) => {
            const sign = track.dataset.marquee === '1' ? -1 : 1;
            const shift = 30 * dir * sign;
            gsap.fromTo(
              track,
              { xPercent: shift > 0 ? -shift : 0 },
              {
                xPercent: shift > 0 ? 0 : shift,
                ease: 'none',
                scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        });

        // ---- image parallax (desktop) ----
        if (full) {
          q('.ezh-split-media img, .ezh-arch-media img').forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -7, scale: 1.14 },
              {
                yPercent: 7,
                scale: 1.14,
                ease: 'none',
                scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        }

        // ---- magnetic buttons (desktop with a real pointer) ----
        if (full && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          q('.ez-btn-lg').forEach((btn) => {
            const move = (e) => {
              const r = btn.getBoundingClientRect();
              gsap.to(btn, {
                x: (e.clientX - (r.left + r.width / 2)) * 0.22,
                y: (e.clientY - (r.top + r.height / 2)) * 0.32,
                duration: 0.4,
                ease: 'power3.out',
              });
            };
            const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
            btn.addEventListener('mousemove', move);
            btn.addEventListener('mouseleave', leave);
            cleanups.push(() => {
              btn.removeEventListener('mousemove', move);
              btn.removeEventListener('mouseleave', leave);
            });
          });
        }

        // ---- keep trigger positions right while images and fonts load ----
        let t;
        const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 150); };
        root.querySelectorAll('img').forEach((img) => {
          if (!img.complete) img.addEventListener('load', refresh, { once: true });
        });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
        cleanups.push(() => clearTimeout(t));

        return () => cleanups.forEach((fn) => fn());
      },
      root,
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);
}
