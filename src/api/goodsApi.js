import { getToken } from '../utils/authStorage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch { /* ignore */ }
    const err = new Error(msg);
    err.response = { data: { message: msg } };
    throw err;
  }

  return res.status === 204 ? null : res.json();
}

export const listGoods = (companyId) =>
  request(companyId ? `/goods?companyId=${companyId}` : '/goods').then((r) => r.goods);

export const createGoods = (payload) =>
  request('/goods', { method: 'POST', body: JSON.stringify(payload) }).then((r) => r.goods);

export const updateGoods = (id, payload) =>
  request(`/goods/${id}`, { method: 'PUT', body: JSON.stringify(payload) }).then((r) => r.goods);

export const deleteGoods = (id) =>
  request(`/goods/${id}`, { method: 'DELETE' });
