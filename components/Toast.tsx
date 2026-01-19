
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, XIcon } from './icons/AllIcons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="h-6 w-6 text-success" />,
    style: 'bg-white border-success',
  },
  error: {
    icon: <XCircleIcon className="h-6 w-6 text-danger" />,
    style: 'bg-white border-danger',
  },
  info: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-primary" />,
    style: 'bg-white border-primary',
  },
  warning: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-warning" />,
    style: 'bg-white border-warning',
  },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onDismiss]);

  const config = toastConfig[type];

  return (
    <div
      className={`relative w-full max-w-sm p-4 pr-10 border rounded-lg shadow-lg flex items-start space-x-3 animate-pop-in ${config.style}`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1 text-sm font-medium text-neutral-800">
        {message}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-1 right-1 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Dismiss"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
