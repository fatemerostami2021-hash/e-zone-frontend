/* =========================================
   E-ZONE · Cookie utilities
   فقط توابع خالص، بدون JSX
   ========================================= */

const COOKIE_KEY = 'ez_cookie_consent_v1';
export const OPEN_COOKIE_EVENT = 'ez-open-cookie-settings';
export const COOKIE_CHANGED_EVENT = 'ez-cookie-changed';

/* خواندن وضعیت رضایت */
export function getConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

/* ذخیرهٔ رضایت */
export function saveConsent(value) {
  const payload = {
    necessary: true,
    analytics: !!value?.analytics,
    marketing: !!value?.marketing,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
  } catch {
    /* حالت private mode یا سهمیه پر */
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CHANGED_EVENT, { detail: payload }));
  return payload;
}

/* پاک کردن رضایت (برای تست یا دکمهٔ reset) */
export function clearConsent() {
  try {
    localStorage.removeItem(COOKIE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(COOKIE_CHANGED_EVENT));
}

/* باز کردن مجدد مودال از هر جای برنامه (مثلاً از فوتر) */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_EVENT));
}

/* آیا کاربر قبلاً انتخاب کرده؟ */
export function hasConsent() {
  return getConsent() !== null;
}