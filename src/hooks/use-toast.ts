
import { useState, useEffect, useCallback } from "react";

// Define the Toast type
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Define the props for the useToast hook
export interface UseToastProps {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToast = (): UseToastProps => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, ...props }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, toast, dismiss };
};

// Create a standalone toast function
let toastFn: (props: Omit<Toast, "id">) => void;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  useEffect(() => {
    toastFn = toast;
  }, [toast]);
  
  return <>{children}</>;
};

export const toast = (props: Omit<Toast, "id">) => {
  if (toastFn) {
    toastFn(props);
  } else {
    console.warn("Toast function not initialized. Make sure to use the ToastProvider.");
  }
};
