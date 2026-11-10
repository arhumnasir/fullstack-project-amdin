import React from 'react';
import { Bell, Check, ShoppingBag, AlertTriangle, Shield, Cpu, X } from 'lucide-react';

export default function NotificationDropdown({
  id = 'notification-dropdown',
  notifications = [],
  isOpen,
  onClose,
  onMarkAllRead,
  onMarkRead,
  onClear,
}) {
  if (!isOpen) return null;

  const iconMap = {
    order: <ShoppingBag className="w-4 h-4 text-orange-500" />,
    stock: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    security: <Shield className="w-4 h-4 text-rose-500" />,
    system: <Cpu className="w-4 h-4 text-orange-500" />,
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      id={id}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-stone-500" />
          <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={onMarkAllRead}
            className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-stone-400">
            No notifications available
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-stone-800/60 transition-colors ${
                item.unread ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 shrink-0 mt-0.5">
                {iconMap[item.type] || <Bell className="w-4 h-4 text-stone-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                  {item.message}
                </p>
                {item.unread && (
                  <button
                    onClick={() => onMarkRead(item.id)}
                    className="mt-1 text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <button
                onClick={() => onClear(item.id)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 bg-zinc-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 text-center">
        <button
          onClick={onClose}
          className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
        >
          Close panel
        </button>
      </div>
    </div>
  );
}
