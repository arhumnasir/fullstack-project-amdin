import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  id,
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
            )}
          </div>
          <button
            id={`${id || 'modal'}-close-btn`}
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 bg-zinc-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
