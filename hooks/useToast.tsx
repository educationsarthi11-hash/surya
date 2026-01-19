
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from "react-dom";
import Toast, { ToastProps } from '../components/Toast';

type ToastOptions = Omit<ToastProps, 'id' | 'onDismiss'>;

interface ToastContextType {
  addToast: (options: ToastOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prevToasts => [...prevToasts, { ...options, id, onDismiss: () => removeToast(id) }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  const success = useCallback((message: string) => {
    addToast({ message, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string) => {
    addToast({ message, type: 'error' });
  }, [addToast]);

  const info = useCallback((message: string) => {
    addToast({ message, type: 'info' });
  }, [addToast]);

  const warning = useCallback((message: string) => {
    addToast({ message, type: 'warning' });
  }, [addToast]);

  // Ensure document is available (client-side)
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  // Safe portal rendering
  const renderToasts = () => {
      if (!mounted || !portalTarget) return null;
      
      const toastList = (
        <div className="fixed top-4 right-4 z-[9999] w-full max-w-xs space-y-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} />
            </div>
          ))}
        </div>
      );

      // Verify createPortal exists to avoid crashes in some environments
      if (typeof createPortal === 'function') {
           try {
               return createPortal(toastList, portalTarget);
           } catch (e) {
               console.error("Portal creation failed", e);
               return null;
           }
      }
      return null;
  };

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
};
