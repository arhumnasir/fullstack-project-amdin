const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

export function getToken() { return localStorage.getItem('shopco_admin_token'); }
export function setSession(token, user) {
  localStorage.setItem('shopco_admin_token', token);
  localStorage.setItem('shopco_admin_user', JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem('shopco_admin_token');
  localStorage.removeItem('shopco_admin_user');
}
export function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('shopco_admin_user') || 'null'); }
  catch { return null; }
}
export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new Error(data.message || data.errors?.[0]?.msg || `Request failed (${response.status})`);
  }
  return data;
}
export const normalizeProduct = (p) => ({
  ...p,
  id: p._id,
  sku: p.sku || (p.legacyId ? `SHOP-${p.legacyId}` : `SKU-${String(p._id || '').slice(-6)}`),
  status: p.stock === 0 ? 'Out of Stock' : p.stock <= 15 ? 'Low Stock' : 'In Stock',
  salesCount: p.salesCount || 0,
});
export const normalizeOrder = (o) => {
  const address = o.shippingAddress || {};
  const shippingAddressText = [
    address.address,
    address.city,
    address.postalCode,
    address.country,
  ].filter(Boolean).join(', ');

  return {
    ...o,
    id: o._id,
    customer: address.fullName || o.user?.name || 'Customer',
    email: o.user?.email || '—',
    date: o.createdAt ? new Date(o.createdAt).toLocaleString() : '—',
    status: (o.status || 'placed').charAt(0).toUpperCase() + (o.status || 'placed').slice(1),
    total: Number(o.total || 0),
    paymentMethod: (o.paymentMethod || 'cash_on_delivery').replaceAll('_', ' '),
    shippingPhone: address.phone || '—',
    // React cannot render a MongoDB subdocument directly. Convert it to safe display text.
    shippingAddress: shippingAddressText || 'Address not provided',
    items: (o.items || []).map((item) => ({
      ...item,
      name: item.name || item.product?.name || 'Product',
      qty: Number(item.quantity ?? item.qty ?? 0),
      price: Number(item.price || 0),
    })),
    itemsCount: o.items?.reduce((sum, item) => sum + Number(item.quantity || item.qty || 0), 0) || 0,
  };
};
