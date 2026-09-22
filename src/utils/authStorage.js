const TOKEN_KEY = 'ezone.token';
const USER_KEY = 'ezone.user';

function getStorage(remember) {
  return remember ? window.localStorage : window.sessionStorage;
}

export function setAuth(token, user, { remember = true } = {}) {
  const s = getStorage(remember);
  s.setItem(TOKEN_KEY, token);
  s.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return (
    window.localStorage.getItem(TOKEN_KEY) ||
    window.sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getUser() {
  const raw =
    window.localStorage.getItem(USER_KEY) ||
    window.sessionStorage.getItem(USER_KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearAuth() {
  [window.localStorage, window.sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY);
    s.removeItem(USER_KEY);
  });
}
