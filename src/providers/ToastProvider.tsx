import React, { createContext, useCallback, useState } from 'react';
import { Toast, ToastProps } from '../components/ui/Toast';

interface ToastContextType {
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps>>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        id,
        type,
        message,
        title,
        onClose: removeToast,
      };
      
      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}