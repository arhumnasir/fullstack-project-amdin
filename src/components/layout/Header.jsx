import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Download,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown.jsx';

export default function Header({
  id = 'app-header',
  isCollapsed,
  setIsMobileOpen,
  searchTerm,
  setSearchTerm,
  notifications,
  setNotifications,
  onOpenNewProduct,
  onExportReport,
  darkMode,
  setDarkMode,
  currentUser,
  onSignOut,
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const handleClear = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  return (
    <header
      id={id}
      className={`fixed top-0 right-0 z-30 h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-all duration-200 ${
        isCollapsed ? 'lg:left-20' : 'lg:left-64'
      } left-0`}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-4">
        {/* Left: Mobile menu toggle + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 lg:hidden rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -transtone-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across analytics, users, orders, logs..."
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-zinc-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                id="search-clear-btn"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -transtone-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: New Product */}
          <button
            id="quick-add-product-btn"
            onClick={onOpenNewProduct}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Quick Action: Export */}
          <button
            id="quick-export-btn"
            onClick={onExportReport}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-200 dark:border-stone-700 hover:bg-zinc-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
            title="Export CSV Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="notifications-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                </span>
              )}
            </button>

            <NotificationDropdown
              notifications={notifications}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkRead}
              onClear={handleClear}
            />
          </div>

          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-0.5 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button
              id="user-profile-menu-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left"
            >
              <img
                src={currentUser?.avatar || 'data:image/jpeg;base64,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'}
                alt={currentUser?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-700"
              />
              <div className="hidden lg:block text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate max-w-[120px]">
                  {currentUser?.name || 'Elena Rostova'}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:block" />
            </button>

            {isProfileOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl py-1.5 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="font-semibold text-stone-900 dark:text-white truncate">
                    {currentUser?.name || 'Elena Rostova'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {currentUser?.email || 'elena.rostova@nexus.io'}
                  </p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 flex items-center justify-between text-stone-500">
                    <span>Role</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {currentUser?.role || 'Super Admin'}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between text-stone-500">
                    <span>System Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Online
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 dark:border-stone-800 pt-1">
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
