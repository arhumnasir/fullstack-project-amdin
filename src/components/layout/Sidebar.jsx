import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  counts = {},
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'users',
      label: 'Users & Customers',
      icon: Users,
      badge: counts.usersCount || null,
      badgeColor: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
    },
    {
      id: 'products',
      label: 'Products & Stock',
      icon: Package,
      badge: counts.lowStockCount ? `${counts.lowStockCount} low` : null,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: counts.pendingOrdersCount || null,
      badgeColor: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400',
    },
    {
      id: 'logs',
      label: 'Activity Logs',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 z-40 bg-stone-900/50 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-stone-900 text-stone-300 border-r border-stone-800 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'transtone-x-0' : '-transtone-x-full lg:transtone-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-600 text-white font-bold shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-white truncate">
                  SHOP.CO
                </span>
                <span className="text-[11px] font-medium text-stone-400 truncate">
                 T-Shirt Enterprise  v2.0 
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
              Main Navigation
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/80'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & Support */}
        <div className="p-3 border-t border-stone-800">
          {!isCollapsed ? (
            <div className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50">
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-stone-200">
                <LifeBuoy className="w-4 h-4 text-orange-400" />
                <span>Need Support?</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Direct developer hotline active 24/7.
              </p>
              <div className="mt-2 text-[10px] text-stone-500 flex items-center justify-between">
                <span>Cluster: us-east-1</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="System Operational">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
