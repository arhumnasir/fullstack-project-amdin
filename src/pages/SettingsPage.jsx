import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Bell,
  Sliders,
  Check,
  Copy,
  Plus,
  Trash2,
  Lock,
  Save,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';

export default function SettingsPage({ currentUser, setCurrentUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Arhum Khan',
    email: currentUser?.email || 'Arhum Khan',
    phone: '+92 3XXXXXXXXXX',
    department: 'Co - Founder',
    bio: 'Co - Founder ',
  });

  // System General Preferences
  const [generalPrefs, setGeneralPrefs] = useState({
    appName: 'SHOP.CO',
    supportEmail: 'shop@co.io',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
  });

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Notification Preferences
  const [notifSettings, setNotifSettings] = useState({
    emailOrders: true,
    emailLowStock: true,
    emailSecurity: true,
    weeklyReport: false,
    pushAlerts: true,
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key_1',
      name: 'Production Server Ingestion',
      prefix: 'sk_live_98a7...',
      full: 'sk_live_98a782b1c4e9f029384756102938475a',
      created: '2025-01-10',
      lastUsed: '2 mins ago',
    },
    {
      id: 'key_2',
      name: 'Analytics ETL Pipeline',
      prefix: 'sk_live_33f2...',
      full: 'sk_live_33f211d09e8a7b6c5d4e3f2a1b0c9d8e',
      created: '2025-03-22',
      lastUsed: 'Yesterday',
    },
  ]);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setCurrentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        name: profileData.name,
        email: profileData.email,
      }));
    }
    triggerSaveBanner();
  };

  const triggerSaveBanner = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyKey = (keyItem) => {
    navigator.clipboard?.writeText(keyItem.full);
    setCopiedKeyId(keyItem.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: `API Token #${apiKeys.length + 1}`,
      prefix: 'sk_live_new...',
      full: `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys([...apiKeys, newKey]);
    triggerSaveBanner();
  };

  const handleRevokeKey = (id) => {
    if (window.confirm('Are you sure you want to revoke this API token immediately?')) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    }
  };

  return (
    <div id="settings-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            System & Workspace Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Configure identity credentials, operational parameters, security tokens, and notifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 dark:border-stone-800 overflow-x-auto pb-px">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'general', label: 'Platform Config', icon: Sliders },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
          { id: 'apikeys', label: 'Developer API Keys', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs max-w-3xl">
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <img
                src={currentUser?.avatar || 'data:image/jpeg;base64,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'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  Profile Avatar
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Synchronized with internal federated identity directory.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Executive Bio
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: General Platform */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Organization / App Name
              </label>
              <input
                type="text"
                value={generalPrefs.appName}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, appName: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                System Support Inquiries
              </label>
              <input
                type="email"
                value={generalPrefs.supportEmail}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Default Currency
              </label>
              <select
                value={generalPrefs.currency}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, currency: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Server Time Zone
              </label>
              <select
                value={generalPrefs.timezone}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (US Eastern)</option>
                <option value="PST">PST (US Pacific)</option>
                <option value="CET">CET (Central European)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Date Display Format
              </label>
              <select
                value={generalPrefs.dateFormat}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, dateFormat: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={triggerSaveBanner}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update Platform Configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-5 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-zinc-50/60 dark:bg-stone-800/40">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Two-Factor Authentication (2FA)
                </h4>
                <p className="text-stone-500 mt-0.5">
                  Enforces hardware security keys (FIDO2) or TOTP authenticator app tokens.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerSaveBanner();
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                twoFactorEnabled ? 'bg-orange-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  twoFactorEnabled ? 'transtone-x-5' : 'transtone-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Idle Session Inactivity Expiry (Minutes)
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => {
                setSessionTimeout(e.target.value);
                triggerSaveBanner();
              }}
              className="w-full sm:w-64 px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="60">60 Minutes</option>
              <option value="240">4 Hours</option>
            </select>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
              Password Rotation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                placeholder="Current Administrative Password"
                className="px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="New Cryptographically Strong Password"
                className="px-3 py-2 bg-zinc-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={triggerSaveBanner}
              className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-4 text-xs">
          {[
            { key: 'emailOrders', title: 'High-Value Order Alerts', desc: 'Trigger instantaneous dispatch notices for orders above $500.00.' },
            { key: 'emailLowStock', title: 'Warehouse Restock Alerts', desc: 'Receive urgent notices when SKUs breach safety inventory thresholds.' },
            { key: 'emailSecurity', title: 'Security Incident Warnings', desc: 'Notify immediately upon failed credential bursts or IP anomaly flags.' },
            { key: 'weeklyReport', title: 'Weekly Executive Briefing', desc: 'Aggregate weekly sales KPIs and customer cohort retention analysis.' },
            { key: 'pushAlerts', title: 'Browser Real-time Web Push', desc: 'Allow browser notifications for incoming urgent tickets and transactions.' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800"
            >
              <div>
                <h4 className="font-semibold text-stone-900 dark:text-white">{item.title}</h4>
                <p className="text-stone-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => {
                  setNotifSettings({
                    ...notifSettings,
                    [item.key]: !notifSettings[item.key],
                  });
                  triggerSaveBanner();
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifSettings[item.key] ? 'bg-orange-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifSettings[item.key] ? 'transtone-x-4' : 'transtone-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: API Keys */}
      {activeTab === 'apikeys' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                Authorized Secret Keys
              </h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Machine-to-machine authentication tokens for REST API integration.
              </p>
            </div>
            <button
              id="generate-api-key-btn"
              onClick={handleGenerateKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Token</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-stone-800/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 dark:text-white">
                      {k.name}
                    </span>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-stone-400 text-[11px] mt-1 font-mono">
                    <span>{k.prefix}</span>
                    <span>Created: {k.created}</span>
                    <span>Last used: {k.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopyKey(k)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-[11px] font-medium"
                  >
                    {copiedKeyId === k.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-1.5 rounded-md text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Revoke Token"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
