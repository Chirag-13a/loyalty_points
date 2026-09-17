import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 4200);
  };
  const value = useMemo(() => ({ notify }), []);
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack">{toasts.map(toast => <div className={`toast ${toast.type}`} key={toast.id}>{toast.message}</div>)}</div></ToastContext.Provider>;
}
export function useToast() { return useContext(ToastContext); }
