// Default targets for the home-page buttons.
// The backend (GET /api/home -> `links`) can override any of them, e.g.
//   links: { heroPrimary: { to: '/login', label_fa: '...', label_en: '...' } }
// A value may also be a plain string: heroPrimary: '/login'
export const DEFAULT_HOME_LINKS = {
  heroPrimary: { to: '/login' },
  heroSecondary: { to: '/contact' },
  ctaPrimary: { to: '/login' },
  ctaSecondary: { to: '/contact?topic=demo' },
};

const normalize = (v) => (typeof v === 'string' ? { to: v } : v || {});

export function mergeHomeLinks(fromApi) {
  const out = {};
  Object.keys(DEFAULT_HOME_LINKS).forEach((key) => {
    const api = normalize(fromApi && fromApi[key]);
    out[key] = { ...DEFAULT_HOME_LINKS[key], ...(api.to ? api : {}) };
  });
  return out;
}

// label from the API (label_fa / label_en) or the i18n fallback
export const linkLabel = (link, isFa, fallback) =>
  (isFa ? link.label_fa : link.label_en) || fallback;
