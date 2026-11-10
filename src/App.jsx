import React, { useState, useEffect, useCallback } from 'react';
import { api, clearSession, getSavedUser, getToken, normalizeProduct, normalizeOrder, setSession } from './lib/api.js';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import {
  initialStats,
  revenueData,
  categorySalesData,
  initialUsers,
  initialProducts,
  initialOrders,
  trafficSourceData,
  deviceAnalyticsData,
  initialActivityLogs,
  initialNotifications,
} from './data/mockData.js';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setError(''); setBusy(true); try { const result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); if (result.user?.role !== 'admin') throw new Error('This account is not an admin account. Set role to admin in MongoDB first.'); setSession(result.token, result.user); onLogin(result.user); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4"><form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5"><div><p className="text-orange-600 font-bold tracking-widest text-xs">SHOP.CO</p><h1 className="text-2xl font-bold mt-2">Admin sign in</h1><p className="text-sm text-stone-500 mt-1">Sign in with an admin account from your Shop.Co database.</p></div>{error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}<label className="block text-sm">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded-lg p-3" /></label><label className="block text-sm">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded-lg p-3" /></label><button disabled={busy} className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-3 font-semibold disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button></form></div>;
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // App dataset states
  const [stats, setStats] = useState({ ...initialStats, totalRevenue: 0, activeUsers: 0, totalOrders: 0 });
  const [revenueTimeline, setRevenueTimeline] = useState(revenueData);
  const [categorySales, setCategorySales] = useState(categorySalesData);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState(initialActivityLogs);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Quick modals and details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Current admin user
  const [currentUser, setCurrentUser] = useState(getSavedUser());
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [loadError, setLoadError] = useState('');

  const loadStoreData = useCallback(async () => {
    try {
      setLoadError('');
      const [productResult, orderResult] = await Promise.all([api('/products?limit=100'), api('/orders')]);
      const nextProducts = (productResult.products || []).map(normalizeProduct);
      const nextOrders = (orderResult.orders || []).map(normalizeOrder);
      setProducts(nextProducts);
      setOrders(nextOrders);
      const revenue = nextOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
      setStats(prev => ({ ...prev, totalRevenue: revenue, totalOrders: nextOrders.length, activeUsers: new Set(nextOrders.map(o => o.user?._id).filter(Boolean)).size }));
    } catch (error) { setLoadError(error.message); if (/token|login|admin/i.test(error.message)) { clearSession(); setAuthenticated(false); setCurrentUser(null); } }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    api('/auth/me').then(({ user }) => {
      if (user?.role !== 'admin') throw new Error('Admin access required');
      setCurrentUser(user);
      return loadStoreData();
    }).catch(error => { setLoadError(error.message); clearSession(); setAuthenticated(false); setCurrentUser(null); });
  }, [authenticated, loadStoreData]);

  const handleLogin = (user) => { setCurrentUser(user); setAuthenticated(true); };

  // Dark mode effect on root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Dynamic badge counts for sidebar
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing').length;

  const handleExportReport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status'].join(','),
      ...orders.map((o) =>
        [o.id, `"${o.customer}"`, o.email, o.date, o.total.toFixed(2), o.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `executive_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectOrderAndNavigate = (order) => {
    setSelectedOrder(order);
    setActivePage('orders');
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-150">
      {/* Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        counts={{
          usersCount: users.length,
          lowStockCount: lowStockCount,
          pendingOrdersCount: pendingOrdersCount,
        }}
      />

      {/* Top Application Header */}
      <Header
        isCollapsed={isSidebarCollapsed}
        setIsMobileOpen={setIsMobileSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        setNotifications={setNotifications}
        onOpenNewProduct={() => {
          setActivePage('products');
          setIsAddProductModalOpen(true);
        }}
        onExportReport={handleExportReport}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onSignOut={() => { clearSession(); setAuthenticated(false); setCurrentUser(null); }}
      />

      {/* Main Content Area */}
      <main
        id="main-content-viewport"
        className={`flex-1 transition-all duration-200 ease-in-out pt-16 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {loadError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{loadError} <button className="ml-2 underline" onClick={loadStoreData}>Retry</button></div>}
          {activePage === 'dashboard' && (
            <DashboardPage
              stats={stats}
              revenueTimeline={revenueTimeline}
              categorySales={categorySales}
              orders={orders}
              users={users}
              onNavigate={setActivePage}
              onSelectOrder={handleSelectOrderAndNavigate}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              trafficSources={trafficSourceData}
              deviceAnalytics={deviceAnalyticsData}
            />
          )}

          {activePage === 'users' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><h2 className="font-bold text-lg">Customer directory is not available in the current backend</h2><p className="mt-2">The existing Shop.Co backend exposes customer login but does not provide an admin users-list endpoint. To keep your existing backend unchanged, this page is not showing fake customer records.</p></div>
          )}

          {activePage === 'products' && (
            <ProductsPage
              products={products}
              setProducts={setProducts}
              onCreateProduct={async (payload) => { const r = await api('/products', { method: 'POST', body: JSON.stringify(payload) }); setProducts(prev => [normalizeProduct(r.product), ...prev]); }}
              onUpdateProduct={async (id, payload) => { const r = await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); setProducts(prev => prev.map(p => p.id === id ? normalizeProduct(r.product) : p)); }}
              onDeleteProduct={async (id) => { await api(`/products/${id}`, { method: 'DELETE' }); setProducts(prev => prev.filter(p => p.id !== id)); }}
              searchTerm={searchTerm}
              isAddModalOpen={isAddProductModalOpen}
              setIsAddModalOpen={setIsAddProductModalOpen}
            />
          )}

          {activePage === 'orders' && (
            <OrdersPage
              orders={orders}
              setOrders={setOrders}
              onUpdateOrderStatus={async (id, status) => { const r = await api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: status.toLowerCase() }) }); setOrders(prev => prev.map(o => o.id === id ? normalizeOrder(r.order) : o)); return normalizeOrder(r.order); }}
              searchTerm={searchTerm}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              onExportReport={handleExportReport}
            />
          )}

          {activePage === 'logs' && (
            <LogsPage
              logs={logs}
              setLogs={setLogs}
              searchTerm={searchTerm}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}
        </div>
      </main>
    </div>
  );
}
