
import React, { useEffect } from "react";
import { useToast, setToastFunction } from "@/hooks/use-toast";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  useEffect(() => {
    setToastFunction(toast);
  }, [toast]);
  
  return <>{children}</>;
};
