import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getConsent,
  saveConsent,
  OPEN_COOKIE_EVENT,
} from './cookieUtils';
import './CookieConsent.css';

const TEXT = {
  fa: {
    title: 'این وب‌سایت از کوکی استفاده می‌کند',
    body:
      'ایزون برای ارائه‌ی بهترین تجربه‌ی کاربری از کوکی‌ها استفاده می‌کند. کوکی‌های ضروری برای عملکرد سایت لازم‌اند؛ کوکی‌های تحلیلی و بازاریابی فقط با اجازه‌ی شما فعال می‌شوند. با کلیک روی «پذیرش همه» استفاده از همه‌ی کوکی‌ها را می‌پذیرید، با «تنظیمات» می‌توانید انتخاب‌های خود را شخصی‌سازی کنید و با «فقط کوکی‌های ضروری» تنها کوکی‌های لازم فعال می‌مانند. این تنظیمات را هر زمان می‌توانید از «تنظیمات حریم خصوصی» پایین صفحه تغییر دهید.',
    onlyRequired: 'فقط کوکی‌های ضروری',
    configure: 'تنظیمات',
    acceptAll: 'پذیرش همه',
    save: 'ذخیره‌ی انتخاب‌ها',
    back: 'بازگشت',
    categories: {
      necessary: ['ضروری', 'برای ورود، امنیت و عملکرد پایه‌ی سایت لازم است و قابل غیرفعال‌سازی نیست.'],
      analytics: ['تحلیلی', 'به ما کمک می‌کند بفهمیم کاربران از سایت چگونه استفاده می‌کنند.'],
      marketing: ['بازاریابی', 'برای نمایش محتوای مرتبط و سنجش کمپین‌ها استفاده می‌شود.'],
    },
  },
  en: {
    title: 'Our website uses cookies',
    body:
      'E-ZONE uses cookies to give you the best possible experience. Necessary cookies are required for the site to work; analytics and marketing cookies are only enabled with your consent. Click “Accept all” to allow every cookie, “Configure” to customize your choices, or “Only required cookies” to keep just the necessary ones. You can change these settings at any time via “Privacy settings” at the bottom of the page.',
    onlyRequired: 'Only required cookies',
    configure: 'Configure',
    acceptAll: 'Accept all',
    save: 'Save choices',
    back: 'Back',
    categories: {
      necessary: ['Necessary', 'Required for login, security and basic site functionality. Cannot be disabled.'],
      analytics: ['Analytics', 'Helps us understand how visitors use the site.'],
      marketing: ['Marketing', 'Used to show relevant content and measure campaigns.'],
    },
  },
};

/* زبان از <html lang> */
const subscribeLang = (callback) => {
  const obs = new MutationObserver(callback);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
  return () => obs.disconnect();
};
const getLang = () =>
  document.documentElement.lang?.startsWith('en') ? 'en' : 'fa';

export default function CookieConsent() {
  const [open, setOpen] = useState(() => !getConsent());
  const [configuring, setConfiguring] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    const s = getConsent();
    return { analytics: !!s?.analytics, marketing: !!s?.marketing };
  });
  const lang = useSyncExternalStore(subscribeLang, getLang, () => 'fa');

  /* باز شدن دوباره از فوتر */
  useEffect(() => {
    const reopen = () => {
      const s = getConsent();
      setPrefs({ analytics: !!s?.analytics, marketing: !!s?.marketing });
      setConfiguring(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_EVENT, reopen);
  }, []);

  /* قفل اسکرول */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* بستن با Esc (فقط اگر قبلاً ذخیره شده باشد) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && getConsent()) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const save = (value) => {
    saveConsent(value);
    setPrefs({ analytics: value.analytics, marketing: value.marketing });
    setOpen(false);
    setConfiguring(false);
    // TODO: لود اسکریپت‌های analytics/marketing بر اساس value
  };

  if (!open) return null;

  const t = TEXT[lang];
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  return (
    <div
      className="ez-cookie-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      dir={dir}
    >
      <div className="ez-cookie-panel">
        <h2 id="cookie-title" className="ez-cookie-title">{t.title}</h2>

        {!configuring ? (
          <p className="ez-cookie-body">{t.body}</p>
        ) : (
          <div className="ez-cookie-cats">
            {Object.entries(t.categories).map(([key, [name, desc]]) => (
              <label key={key} className="ez-cookie-cat">
                <span className="ez-cookie-cat-text">
                  <span className="ez-cookie-cat-name">{name}</span>
                  <span className="ez-cookie-cat-desc">{desc}</span>
                </span>
                <input
                  type="checkbox"
                  className="ez-cookie-check"
                  checked={key === 'necessary' ? true : prefs[key]}
                  disabled={key === 'necessary'}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, [key]: e.target.checked }))
                  }
                />
              </label>
            ))}
          </div>
        )}

        <div className="ez-cookie-actions">
          {!configuring ? (
            <>
              <button
                type="button"
                className="ez-cookie-btn ez-cookie-btn--ghost"
                onClick={() => save({ analytics: false, marketing: false })}
              >
                {t.onlyRequired}
              </button>
              <button
                type="button"
                className="ez-cookie-btn ez-cookie-btn--outline"
                onClick={() => setConfiguring(true)}
              >
                {t.configure}
              </button>
              <button
                type="button"
                className="ez-cookie-btn ez-cookie-btn--primary"
                onClick={() => save({ analytics: true, marketing: true })}
              >
                {t.acceptAll}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="ez-cookie-btn ez-cookie-btn--ghost"
                onClick={() => setConfiguring(false)}
              >
                {t.back}
              </button>
              <button
                type="button"
                className="ez-cookie-btn ez-cookie-btn--primary"
                onClick={() => save(prefs)}
              >
                {t.save}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}