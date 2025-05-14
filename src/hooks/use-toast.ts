
import { useState, useCallback } from "react";

// Define the Toast type
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export interface UseToastProps {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

// Global toast function reference
let globalToastFn: ((props: Omit<Toast, "id">) => void) | null = null;

export const useToast = (): UseToastProps => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, ...props }]);
    
    // Auto dismiss after the specified duration or default to 5 seconds
    const duration = props.duration || 5000;
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Set the global toast function when a component uses this hook
  if (globalToastFn === null) {
    globalToastFn = toast;
  }

  return { toasts, toast, dismiss };
};

// Standalone toast function that uses the global toast function
export const toast = (props: Omit<Toast, "id">) => {
  if (globalToastFn) {
    globalToastFn(props);
  } else {
    console.warn("Toast function not initialized. Make sure ToastProvider is mounted.");
  }
};

// Function to set the toast function for use outside of React components
export const setToastFunction = (toastFn: (props: Omit<Toast, "id">) => void) => {
  globalToastFn = toastFn;
};
