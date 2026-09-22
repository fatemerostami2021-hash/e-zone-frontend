const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function login(email, password, { remember = true } = {}) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember }),
  });

  if (!res.ok) {
    let msg = 'Login failed';
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch { /* ignore */ }
    const err = new Error(msg);
    err.response = { data: { message: msg } };
    throw err;
  }

  // انتظار: { token, user }
  return res.json();
}
