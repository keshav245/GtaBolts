'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  severity: ToastSeverity;
  message: string;
}

interface ToastContextValue {
  showToast: (severity: ToastSeverity, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const SEVERITY_CONFIG: Record<ToastSeverity, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: 'border-signal/40 text-signal bg-signal/10' },
  error: { icon: XCircle, className: 'border-alert/40 text-alert bg-alert/10' },
  warning: { icon: AlertTriangle, className: 'border-yellow-400/40 text-yellow-300 bg-yellow-400/10' },
  info: { icon: Info, className: 'border-cyan/40 text-cyan bg-cyan/10' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((severity: ToastSeverity, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, severity, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { icon: Icon, className } = SEVERITY_CONFIG[toast.severity];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                className={cn('glass-strong rounded-md border p-3 flex items-start gap-2.5', className)}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm text-white flex-1">{toast.message}</p>
                <button onClick={() => dismiss(toast.id)} className="text-fog-dim hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
