
import React, { useEffect } from "react";
import { useToast, setToastFunction } from "@/hooks/use-toast";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Set the global toast function when the ToastProvider mounts
    setToastFunction(toast);
    return () => setToastFunction(() => {
      console.warn("Toast provider unmounted");
    });
  }, [toast]);
  
  return <>{children}</>;
};
